import { Container } from "@mui/material";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { mockData } from "~/apis/mock-data";
import { useEffect, useState } from "react";
import { fetchBoardDetailsAPI } from "~/apis";

function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = "67935678948b01d579391367";
    fetchBoardDetailsAPI(boardId).then( board  => {
      setBoard(board);
    });
  }, []);

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ width: "100vw", height: "100vh" }}
    >
      <AppBar />
      <BoardBar board={mockData.board} />

      <BoardContent board={mockData.board} />
    </Container>
  );
}
export default Board;
