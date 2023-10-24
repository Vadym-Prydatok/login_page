import { useEffect, useRef, useState } from "react";
import { User } from "../types/User";
import { Data } from "../types/Data";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../app/authSlice";
import { RootState } from "../app/store";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { client } from "../api/fetchData";
import { visibleData } from "../helper/visibleData";
import { validation } from "../helper/validation";
import { decrementPage, incrementPage } from "../app/pageSlice";
import classNames from "classnames";

type Table = {
  row: number | null;
  col: number | null;
};

export const Main = () => {
  const isAuthenticated = useSelector((state: RootState) =>
  selectIsAuthenticated(state)
);
const currentPage = useSelector((state: RootState) => state.pagination.currentPage);
const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState<Table>({ row: null, col: null });
  const [newData, setNewData] = useState("");
  const [message, setMessage] = useState("");
  const [usersCount, setUsersCount] = useState(0);
  const transitionNodeRef = useRef(null);
  const [users, setUsers] = useState<User[]>([]);

  const itemsPerPage = 10;
  const startRange = (currentPage - 1) * itemsPerPage;
  const endRange = Math.min(startRange + itemsPerPage, usersCount);

  const totalPages = Math.ceil(usersCount / itemsPerPage);

  const navigate = useNavigate();

  const prevPage = (page: number) => {
    navigate(`/main/${page - 1}`)
    dispatch(decrementPage())
  }

  const nextPage = (page: number) => {
    navigate(`/main/${page + 1}`)
    dispatch(incrementPage())
  }

  const handleEdit = (row: number, col: number, value: string | number) => {
    setIsEditing({ row, col });
    setNewData(value.toString());
  };

  const updateDataOnServer = async (
    userId: number,
    columnName: string,
    newValue: string
  ) => {
    try {
      await client.patch(
        `https://technical-task-api.icapgroupgmbh.com/api/table/${userId}/`,
        {
          [columnName]: newValue,
        }
      );

      setMessage("Success");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  };

  const handleSave = () => {
    if (isEditing.row !== null && isEditing.col !== null) {
      const updatedUsers = [...users];
      const userId = users[isEditing.row].id;
      const columnName = Object.keys(updatedUsers[0])[isEditing.col];
      const newValue = newData;

      const validData = validation(columnName, newValue);

      if (typeof validData === "boolean") {
        updatedUsers[isEditing.row][columnName] = newValue;

        updateDataOnServer(userId, columnName, newValue);

        loadingData();
      } else {
        setMessage(validData || "");
      }
    }
    setIsEditing({ row: null, col: null });
  };

  const loadingData = async () => {
    try {
      const data = await client.initGet<Data>();
      const dataAll = await client.get<Data>(
        `https://technical-task-api.icapgroupgmbh.com/api/table/?limit=${data.count}`
      );

      setUsers(dataAll.results);
      setUsersCount(data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadingData();
  }, []);

  const visibleUsers = visibleData(users, startRange, endRange);

  return (
    <div>
      <div className="main_header">
        <button className="backButton" onClick={() => navigate("/")}>
          Back
        </button>
        <h1 className={classNames({ 'active': isAuthenticated })}>{isAuthenticated ? "Log In" : "Log Out"}</h1>
      </div>

      <SwitchTransition>
        <CSSTransition
          key={currentPage}
          in={true}
          classNames={"fade"}
          timeout={300}
          unmountOnExit
          nodeRef={transitionNodeRef}
        >
          <table className="data-table" ref={transitionNodeRef}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Birthday Date</th>
                <th>Phone Number</th>
                <th>Address</th>
              </tr>
            </thead>

            <tbody>
              {visibleUsers.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      onDoubleClick={() =>
                        handleEdit(rowIndex, colIndex, value)
                      }
                    >
                      {isEditing.row === rowIndex &&
                      isEditing.col === colIndex ? (
                        <input
                          type="text"
                          className="pasteInput"
                          autoFocus
                          value={newData}
                          onChange={(e) => setNewData(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                          }}
                          onBlur={handleSave}
                        />
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CSSTransition>
      </SwitchTransition>

      <div className="main_bottom">
        <button onClick={() => prevPage(currentPage)} disabled={currentPage === 1}>
          prev
        </button>
        <div className="pagination">
          <span>{startRange}</span>...<span>{endRange}</span>
        </div>
        <button onClick={() => nextPage(currentPage)} disabled={currentPage === totalPages}>
          next
        </button>
      </div>
      <h1 className="message">{message}</h1>
    </div>
  );
};
