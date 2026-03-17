import React from 'react';

interface TableProps {
  columns: string[];
  data: Array<Record<string, React.ReactNode>>;
  actions?: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ columns, data, actions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 border-b text-left bg-gray-100 dark:bg-gray-700">{col}</th>
            ))}
            {actions && <th className="px-4 py-2 border-b bg-gray-100 dark:bg-gray-700">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 border-b">{row[col]}</td>
              ))}
              {actions && <td className="px-4 py-2 border-b">{actions}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
