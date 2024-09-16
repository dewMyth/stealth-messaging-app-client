import React, { useEffect, useContext, useState } from "react";
import { useNavigation } from "react-router-dom";

import "./Dashboard.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import { Button, Box } from "@mui/material";
import { useGetAllLogsByUser } from "../../hooks/useLogs";
import Conversation from "../../components/Conversation/Conversation";

import {
  useGetRemovedConvByUser,
  useSendConversationUnlockRequest,
} from "../../hooks/useConversationData";

import * as XLSX from "xlsx";

const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName} - ${new Date().toISOString()}.xlsx`);
};

export default function Dashboard() {
  const { user, isFetching, error, dispatch } = useContext(AuthContext);

  const columns = [
    {
      field: "message",
      headerName: "Log Message",
      width: 650,
      filterable: false,
    },
    {
      field: "type",
      headerName: "Log Type",
      width: 400,
      filterable: true,
      renderCell: (params) => {
        if (params.value == "UNLOCKED_CONVERSATION_ATTEMP_FAIL") {
          return <Alert severity="error">{params.value}</Alert>;
        } else if (
          params.value == "SENT_SELF_DESTRUCT_TIMED_MESSAGE" ||
          params.value == "SENT_LIMITED_VIEW_TIME_MESSAGE"
        ) {
          return <Alert severity="info">{params.value}</Alert>;
        } else if (params.value == "DELETED_CONVERSATION") {
          return <Alert severity="warning">{params.value}</Alert>;
        } else {
          return <Alert severity="success">{params.value}</Alert>;
        }
      },
    },
    { field: "time", headerName: "Log Time", width: 200, filterable: false },
  ];

  const {
    data: allLogsByUser,
    isSuccess: isSuccessAllLogsByUser,
    isLoading: isLoadingAllLogsByUser,
    isError: isErrorAllLogsByUser,
  } = useGetAllLogsByUser(user?.id);

  const paginationModel = { page: 0, pageSize: 10 };

  const {
    data: removedConvByUser,
    isLoading: isLoadingRemovedConvByUser,
    isSuccess: isSuccessRemovedConvByUser,
    isError: isErrorRemovedConvByUser,
  } = useGetRemovedConvByUser(user?.id);

  const exportRows = allLogsByUser?.map((row, index) => ({
    "Row Number": index + 1,
    "Log Id": row.id,
    Message: row.message,
    "Log Type": row.type,
    "Log Time": row.time,
  }));

  return (
    <>
      <Header />
      <div className="db-body">
        <div className="db-left">
          <h2>Log Trail</h2>
          <Paper sx={{ height: "75vh", width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                onClick={() =>
                  exportToExcel(exportRows, `Log Export - ${user.userName}`)
                }
                variant="contained"
                color="primary"
              >
                Export to Excel
              </Button>
            </Box>
            <hr />
            <DataGrid
              rows={allLogsByUser}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[10, 20, 30]}
            />
          </Paper>
        </div>
        <div className="db-right">
          <div className="r-top">
            <h5>Recover Deleted Conversations</h5>
            <hr />
            <div className="r-top-content">{/* <Conversation /> */}</div>
            {console.log("length", removedConvByUser?.length)}
            {removedConvByUser?.length == 0 ? (
              <div className="">No Records</div>
            ) : (
              <div className="">
                {removedConvByUser?.map((conv) => {
                  return (
                    <Conversation
                      key={conv.id}
                      conversationData={conv}
                      deleted={true}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <div className="r-bottom">bottom</div>
        </div>
      </div>
    </>
  );
}
