import { Box } from "@mui/system";
import Chip from "@mui/material/Chip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { capitalizeFirstLetter } from "~/utils/formatter";
const MENU_STYLE = {
  color: "white",
  bgcolor: "transparent",
  border: "none",
  paddingX: "5px",
  borderRadius: "4px",
  ".MuiSvgIcon-root": {
    color: "white",
  },
  "&:hover": {
    bgcolor: "primary.50",
  },
};
function BoardBar({ board }) {
  // const { board } = props;

  console.log("board", board);


  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: (theme) => theme.trello.boardBarHeight,
        justifyContent: "space-between",
        gap: 2,
        paddingX: 2,
        overflowX: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Tooltip title= {board?.description}>
          <Chip
            sx={MENU_STYLE}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>

        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label="Add to do Google Drive"
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: "white",
            borderColor: "  white",
            "&:hover": { border: "2px solid white" },
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={7}
          sx={{
            gap: "10px",
            "& .MuiAvatar-root": {
              width: 34,
              height: 34,
              fontSize: "16px",
              border: "none",
              color: "white",
              cursor: "pointer",
              "&:first-of-type": {
                bgcolor: "#a4b0be",
              },
            },
          }}
        >
          <Tooltip title="lehieu">
            <Avatar alt="trungquandev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="trungquandev">
            <Avatar alt="trungquandev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="trungquandev">
            <Avatar alt="trungquandev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="trungquandev">
            <Avatar alt="trungquandev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="trungquandev">
            <Avatar alt="trungquandev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="trungquandev">
            <Avatar alt="trungquandev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="trungquandev">
            <Avatar alt="trungquandev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="trungquandev">
            <Avatar alt="trungquandev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="trungquandev">
            <Avatar alt="trungquandev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="trungquandev">
            <Avatar alt="trungquandev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="trungquandev">
            <Avatar alt="trungquandev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title="trungquandev">
            <Avatar alt="trungquandev" src="/static/images/avatar/1.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
}
export default BoardBar;
