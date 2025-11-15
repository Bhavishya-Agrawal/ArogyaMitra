import React, { useEffect, useState } from "react";
import { getFraudReport } from "../../api/billApi";

export default function FraudReport() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getFraudReport().then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="max-w-xl my-10 p-4">
      <h1 className="text-xl font-bold">Fraud Report</h1>

      {data.frauds.length === 0 ? (
        <p className="text-green-600 mt-4">No fraud detected</p>
      ) : (
        data.frauds.map((f, i) => (
          <div key={i} className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
            <p><strong>Service:</strong> {f.service}</p>
            <p><strong>Charged:</strong> ₹{f.charged}</p>
            <p><strong>Allowed:</strong> ₹{f.allowed}</p>
            <p className="text-red-600">{f.message}</p>
          </div>
        ))
      )}
    </div>
  );
}
