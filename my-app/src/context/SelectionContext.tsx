import { createContext, useContext, useState, ReactNode } from 'react';

const SelectionContext = createContext<any>(null);

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
   const [selectedRows, setSelectedRows] = useState<any[]>([]);

   return (
      <SelectionContext.Provider value={{ selectedRows, setSelectedRows }}>
         {children}
      </SelectionContext.Provider>
   );
};

export const useSelection = () => useContext(SelectionContext);
