import DataTableComponent from "../components/DataTableComponent";

const ArtworksPage = () => {
  return (
    <div>
      <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <h1>Artworks List</h1>
      </div>
      <DataTableComponent />
    </div>
  );
};

export default ArtworksPage;
