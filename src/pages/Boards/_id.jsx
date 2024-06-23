import { Container } from "@mui/material";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { mockData } from "~/apis/mock-data";
function Board() {
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ width: "100vw", height: "100vh" }}
    >
      <AppBar />
      <BoardBar board={mockData?.board} />

      <BoardContent board={mockData?.board} />
    </Container>
  );
}
export default Board;
