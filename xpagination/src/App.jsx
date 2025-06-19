import { useState, useEffect } from "react";
import styles from "./App.module.css";

function App() {
  const [originalData, setOriginalData] = useState([]);
  const maxRecords = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  //fetching data on mount
  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        const data = response.json();
        return data;
      })
      .then((res) => {
        const data = res;
        // console.log(data);
        setOriginalData(data);
      })
      .catch((error) => {
        alert("failed to fetch data");
        console.error("failed to fetch data: ", error);
      });
  }, []);

  //updating the current data on currentPage change or original data change
  useEffect(() => {
    const startInd = (currentPage - 1) * maxRecords;
    const endInd = Math.min(currentPage * maxRecords, originalData.length);
    setCurrentData([...originalData].slice(startInd, endInd));
    setTotalPages(Math.ceil(originalData.length / maxRecords));
  }, [currentPage, originalData]);

  const prev = () => {
    if (currentPage - 1 <= 0) {
      return;
    }
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const next = () => {
    if (currentPage + 1 > totalPages) {
      return;
    }
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <h1 className={styles.heading}>Employee Data Table</h1>
      <div className={styles.table_wrapper}>
        <table className={styles.table}>
          <thead className={styles.table_head}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((data) => {
              return (
                <tr key={data.id}>
                  <td>{data.id}</td>
                  <td>{data.name}</td>
                  <td>{data.email}</td>
                  <td>{data.role}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={styles.button_wrapper}>
        <button type="button" onClick={prev}>Previous</button>
        <p>{currentPage}</p>
        <button type="button" onClick={next}>Next</button>
      </div>
    </div>
  );
}

export default App;