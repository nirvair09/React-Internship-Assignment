import { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';

interface Artwork {
  id: string;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

const DataTableComponent = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [nRows, setNRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState<{ [page: number]: Artwork[] }>({});

  const op = useRef<OverlayPanel>(null);

  // Fetch artworks from the API with pagination
  const fetchArtworks = async (page: number, rows: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rows}`
      );
      setPageData(prevData => ({ ...prevData, [page]: response.data.data }));
      if (page === currentPage) {
        setArtworks(response.data.data);
      }
      setTotalRecords(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts or page changes
  useEffect(() => {
    fetchArtworks(currentPage, 12); // Fetch with default 12 rows
  }, [currentPage]);

  // Handle page change event
  const onPageChange = (event: any) => {
    const newPage = event.page + 1;  // PrimeReact uses 0-based index
    setCurrentPage(newPage);
    setFirst(event.first);
    if (!pageData[newPage]) {
      fetchArtworks(newPage, 12);
    }
  };

  // Fetch all pages needed and then select rows
  const handleSelectTopNRows = async () => {
    let totalFetchedArtworks: Artwork[] = [];
    let fetchedPages = new Set<number>();

    // Determine all pages to fetch
    for (let i = 1; i <= Math.ceil(nRows / 12); i++) { // Assuming 12 rows per page
      if (!pageData[i]) {
        await fetchArtworks(i, 12);
      }
      totalFetchedArtworks = totalFetchedArtworks.concat(pageData[i]);
      fetchedPages.add(i);
    }

    // Update selected rows
    const updatedSelectedRows = new Set(selectedRows);
    let count = 0;

    for (const artwork of totalFetchedArtworks) {
      if (count >= nRows) break;
      updatedSelectedRows.add(artwork.id);
      count++;
    }

    setSelectedRows(updatedSelectedRows);
    op.current?.hide();  // Hide overlay panel after submission
  };

  // Clear all selected rows
  const clearAllSelections = () => {
    setSelectedRows(new Set());
  };

  // Handle overlay panel trigger
  const showOverlay = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    op.current?.toggle(event);
  };

  return (
    <div>
      
      {/* Top right panel with total selected rows and clear button */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '1rem' }}>{selectedRows.size} rows selected</span>
          <Button 
            label="Clear All" 
            onClick={clearAllSelections} 
            className="p-button-danger p-ml-2" 
            style={{ backgroundColor: 'red', borderColor: 'red' }} 
          />
        </div>
      </div>

      {/* Overlay Panel for input */}
      <OverlayPanel ref={op} dismissable>
        <h4>Select Top N Rows</h4>
        <div className="p-field">
          <InputNumber
            value={nRows}
            onValueChange={(e) => setNRows(e.value || 0)}
            placeholder="Enter number of rows"
          />
        </div>
        <Button 
          label="Submit" 
          onClick={handleSelectTopNRows} 
          className="p-button-primary" 
          style={{ backgroundColor: 'blue', borderColor: 'blue' }} 
        />
      </OverlayPanel>

      <DataTable
        value={artworks}
        paginator
        rows={12} // Assuming 12 rows per page
        first={first}
        totalRecords={totalRecords}
        lazy
        onPage={onPageChange}
        loading={loading}
        dataKey="id"
        selection={artworks.filter(artwork => selectedRows.has(artwork.id))}
        onSelectionChange={(e) => {
          const selectedIds = new Set(e.value.map((item: Artwork) => item.id));
          setSelectedRows(selectedIds);
        }}
        selectionMode="multiple"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3em' }}
        />
        <Column
          field="title"
          header={
            <span>
              Title{' '}
              <i
                className="pi pi-external-link"
                style={{ cursor: 'pointer' }}
                onClick={showOverlay} // Show overlay on click
              />
            </span>
          }
        />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
    </div>
  );
};

export default DataTableComponent;
