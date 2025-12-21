import React, { useEffect, useState} from 'react';
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import api from '../../utils/api';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const UsersTable = () => {
  const [rowData, setRowData] = useState([]);

  // Column Definitions: Defines headers, sorting, and filtering
  const colDefs = [
    { field: "name", headerName: "Name", flex: 1, filter: true, floatingFilter: true },
    { field: "email", headerName: "Email", flex: 1.5, filter: true, floatingFilter: true },
    { field: "role", headerName: "Role", width: 100, filter: true },
    { 
      field: "createdAt", 
      headerName: "Joined Date", 
      width: 150, 
      sortable: true,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() 
    },
    {
      headerName: "Actions",
      field: "_id",
      cellRenderer: (params) => (
        <button 
          onClick={() => deleteUser(params.value)}
          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
        >
          Delete
        </button>
      )
    }
  ];

  // Fetch Users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Replace with your actual axios instance if you have one with interceptors
        const res = await api.get('/admin/users');
        setRowData(res.data);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
        await api.delete(`/admin/users/${id}`);
        // Refresh grid by removing the item locally
        setRowData(prev => prev.filter(user => user._id !== id));
    } catch (err) {
        console.error("Delete User Error:", err);
        alert("Failed to delete user");
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-screen">
      <h1 className="text-2xl font-bold mb-4">User Database (Excel View)</h1>
      
      {/* The Grid Component */}
      <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
        <AgGridReact 
            rowData={rowData} 
            columnDefs={colDefs}
            theme={themeQuartz}
            pagination={true}
            paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default UsersTable;