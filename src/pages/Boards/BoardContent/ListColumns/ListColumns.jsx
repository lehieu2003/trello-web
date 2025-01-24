import Box from "@mui/material/Box";
import Column from "./Column/Column";
import Button from "@mui/material/Button";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CloseIcon from "@mui/icons-material/Close";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { toast } from "react-toastify";
import {  TextField } from "@mui/material";

const ListColumns = ({ columns }) => {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toogleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error("Column title is required");
      return;
    }

    // call api to add new column
    console.log(newColumnTitle);

    // Đóng trạng thái thêm column mới và clear input
    toogleNewColumnForm();
    setNewColumnTitle("");
  };
  return (
    /**
     * thằng sortable context yêu cầu items là 1 nảng dạng ["id-1", "id-2", "id-3"] chứ ko phải object [{_id: "id-1"}, {_id: "id-2"}, {_id: "id-3"}]
     * nếu không đúng thì vẫn kéo thả được nhưng không có animation
     * https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
     */

    <SortableContext
      items={columns?.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: "inherit",
          width: "100%",
          height: "100%",
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          "&::-webkit-scrollbar-track": { m: 2 },
        }}
      >
        {columns?.map((column) => (
          <Column key={column._id} column={column} />
        ))}
        {!openNewColumnForm 
          ? 
          <Box
            sx={{
              minWidth: "250px",
              maxWidth: "250px",
              mx: 2,
              borderRadius: "6px",
              height: "fit-content",
              bgcolor: "#ffffff3d",
            }}
            onClick={toogleNewColumnForm}
          >
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: "white",
                width: "100%",
                justifyContent: "flex-start",
                pl: 2.5,
                py: 1,
              }}
            >
              Add new column
            </Button>
          </Box> 
          : 
          <Box sx={{ minWidth: "250px", maxWidth: "250px", mx: 2, p: 1, borderRadius: "6px", height: "fit-content", bgcolor: "#ffffff3d", display: "flex", flexDirection: "column", gap: 1}}>
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}     
              sx={{
                "& label": { color: "white" },
                "& input": { color: "white" },
                "& label.Mui-focused": {
                  color: "white",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
              }}
            />

            <Box sx={{ display: "flex", alignItems:"center", gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: "none",
                  border: "0.5px solid",
                  borderColor: (theme) => theme.palette.success.main,
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.success.main,
                  },
                }}
                onClick={addNewColumn}
              >
                Add column
              </Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  color:"white",
                  cursor: "pointer",
                  "&:hover": {
                    color: (theme) => theme.palette.warning.light,
                  },
                }}
                onClick={toogleNewColumnForm}
              />
            </Box>

          </Box>
        }
        
      </Box>
    </SortableContext>
  );
};

export default ListColumns;
