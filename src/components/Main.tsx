import { useEffect, useRef, useState } from "react";
import { User } from "../types/User";
import { Data } from "../types/Data";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../app/authSlice";
import { RootState } from "../app/store";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { client } from "../api/fetchData";
import { visibleData } from "../helper/visibleData";
import { validation } from "../helper/validation";
import { decrementPage, incrementPage } from "../app/pageSlice";
import classNames from "classnames";
import { Loader } from "./Loader";
import { setIsLoading } from "../app/loadSlice";
import { getSearchWith } from "../helper/searchHelper";
import { Table } from "../types/Table";
import React from "react";

export const Main = React.memo(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const isLoading = useSelector((state: RootState) => state.load.isLoading);
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state)
  );
  const currentPage = useSelector(
    (state: RootState) => state.pagination.currentPage
  );
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
  const BASE_URL = "https://technical-task-api.icapgroupgmbh.com/api/table/";

  useEffect(() => {
    const timeoutMessage = setTimeout(() => setMessage(""), 3000);

    return () => {
      clearTimeout(timeoutMessage);
    };
  }, [message]);

  const prevPage = (page: number) => {
    navigate(`/main/${page - 1}`);
    dispatch(decrementPage());
  };

  const nextPage = (page: number) => {
    navigate(`/main/${page + 1}`);
    dispatch(incrementPage());
  };

  const handleEdit = (row: number, col: number, value: string | number) => {
    setIsEditing({ row, col });
    setMessage("Editing");
    setNewData(value.toString());
  };

  const updateDataOnServer = async (
    userId: number,
    columnName: string,
    newValue: string
  ) => {
    try {
      dispatch(setIsLoading(true));
      await client.patch(`${BASE_URL}${userId}/`, {
        [columnName]: newValue,
      });

      setMessage("Success");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const visibleUsers = visibleData(users, startRange, endRange, query);

  const handleSave = () => {
    if (isEditing.row !== null && isEditing.col !== null && visibleUsers) {
      const userId = visibleUsers[isEditing.row].id;
      const columnName = Object.keys(visibleUsers[0])[isEditing.col];
      const newValue = newData;

      const validData = validation(columnName, newValue);

      if (typeof validData === "boolean") {
        visibleUsers[isEditing.row][columnName] = newValue;

        updateDataOnServer(userId, columnName, newValue);
      } else {
        setMessage(validData || "");
      }
    }
    setIsEditing({ row: null, col: null });
  };

  const loadingData = async () => {
    try {
      dispatch(setIsLoading(true));
      const data = await client.initGet<Data>();
      const dataAll = await client.get<Data>(`${BASE_URL}?limit=${data.count}`);

      setUsers(dataAll.results);
      setUsersCount(data.count);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    loadingData();
  }, []);

  const onQueryChange = (search: string) => {
    setSearchParams(getSearchWith(searchParams, { query: search || null }));
  };

  const onSort = (e: HTMLTableRowElement) => {
    onQueryChange(e.textContent || "");
  };

  return (
    <div>
      <div className="main_header">
        <button className="backButton log_btn" onClick={() => navigate("/")}>
          Back
        </button>
        <h1 className={classNames("message", { visible: message.length > 0 })}>
          {message}
        </h1>
        <h1 className={classNames("log_status", { active: isAuthenticated })}>
          {isAuthenticated ? "Log In" : "Log Out"}
        </h1>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <SwitchTransition>
          <CSSTransition
            key={currentPage}
            in={true}
            classNames={"fade-zoom"}
            timeout={300}
            unmountOnExit
            nodeRef={transitionNodeRef}
          >
            <table className="data-table" ref={transitionNodeRef}>
              <thead>
                <tr onClick={(e) => onSort(e.target as HTMLTableRowElement)}>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Birthday Date</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                </tr>
              </thead>

              <tbody>
                {visibleUsers?.map((row, rowIndex) => (
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
      )}

      <div className="main_bottom">
        <button
          className="log_btn"
          onClick={() => prevPage(currentPage)}
          disabled={currentPage === 1}
        >
          prev
        </button>
        <div className="pagination">
          <span>{startRange}</span>...<span>{endRange}</span>
        </div>
        <button
          className="log_btn"
          onClick={() => nextPage(currentPage)}
          disabled={currentPage === totalPages}
        >
          next
        </button>
      </div>
    </div>
  );
});
