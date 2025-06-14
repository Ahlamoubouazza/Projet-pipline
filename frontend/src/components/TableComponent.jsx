import React from "react";

function TableComponent({ rows }) {
  if (!rows || rows.length === 0) return <p>No data to display</p>;

  const headers = Object.keys(rows[0]);

  return (
    <table className="table-auto border-collapse border border-gray-400 w-full mt-4">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} className="border border-gray-400 px-4 py-2">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {headers.map((header) => (
              <td key={header} className="border border-gray-400 px-4 py-2">
                {row[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableComponent;