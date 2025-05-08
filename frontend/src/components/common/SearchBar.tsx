/* eslint-disable @typescript-eslint/no-explicit-any */
// MUI
import { styled, alpha } from "@mui/material/styles";
import {
  Box,
  InputBase,
  List,
  ListItemButton,
  Stack,
  SxProps,
  Skeleton,
  Theme,
} from "@mui/material";

// Icons
import SearchIcon from "@mui/icons-material/Search";

// Components
import Image from "./Image";
import { OneLineTypography } from "../typography";

// React
import { useEffect, useRef, useState } from "react";
import { getCoursesByQuery } from "@/services/courseService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Course } from "@/types";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "24px",
  backgroundColor: alpha("#adb5bd", 0.5),
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: alpha("#adb5bd", 0.6),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
  },
}));

type Props = {
  sx?: SxProps<Theme>;
};

export default function SearchBar({ sx }: Props) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  // const [data, setData] = useState<ResponseType[]>([]);
  const [show, setShow] = useState(false);
  const [searchParams] = useSearchParams();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const { data: res, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => getCoursesByQuery(query),
    enabled: !!query,
  });

  const data = res?.data || [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        searchRef.current &&
        searchRef.current.contains(e.target as HTMLElement)
      )
        return;
      setShow(false);
    }
    document.documentElement.addEventListener("click", handleClick);
    return () => {
      document.documentElement.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setQuery(queryParam);
    }
  }, [searchParams]);

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  async function handlePointerDown() {
    if (input === "") return;
    setShow(true);
    setQuery(input);
  }

  function handleKeyUp() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      if (input.trim() === "") {
        setShow(false);
      } else {
        setShow(true);
        setQuery(input);
      }
    }, 500);
  }

  function handleOnKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter" || input.trim() === "") return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setQuery(input);
    setShow(false);
    timeoutRef.current = null;
    navigate(`/search?query=${input}`);
  }

  function setInitialState() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setInput("");
    setShow(false);
    timeoutRef.current = null;
  }

  const handleClose = () => {
    setInitialState();
  };

  return (
    <Search sx={sx} ref={searchRef}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        value={input}
        onChange={handleChangeValue}
        onPointerDown={handlePointerDown}
        onKeyUp={handleKeyUp}
        onKeyDown={handleOnKeyDown}
        placeholder="Search for anything..."
        inputProps={{ "aria-label": "search" }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          top: "100%",
          left: 0,
          right: 0,
          zIndex: 1,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "row",
          boxShadow: 3,
          py: 1,
          borderRadius: 1,
          transition: "transform 0.2s ease, opacity 0.2s ease",
          transformOrigin: "top center",
          transform: show ? "scaleY(1)" : "scaleY(0)",
          opacity: show ? 1 : 0,
        }}
      >
        {isLoading && <SearchResultSkeleton />}
        {!isLoading && data && data.length === 0 && (
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              py: 2,
              fontSize: "0.875rem",
              color: "text.secondary",
            }}
          >
            Không tìm thấy kết quả nào.
          </Box>
        )}
        {!isLoading && data && data.length > 0 && (
          <List
            sx={{
              width: "100%",
              p: 0,
              bgcolor: "background.paper",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {data.map((item: any) => (
              <ListItemButton key={item._id}>
                <SearchItem course={item} onClose={handleClose} />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </Search>
  );
}

interface SearchItemProps {
  course: Course;
  onClose: () => void;
}

function SearchItem({ course, onClose }: SearchItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/courses/${course._id}`);
    onClose();
  };

  return (
    <Stack
      sx={{ width: 1, cursor: "pointer" }}
      direction={"row"}
      gap={1}
      alignItems={"flex-start"}
      onClick={handleClick}
    >
      <Box
        sx={{
          width: "40px",
          position: "relative",
          aspectRatio: "1/1",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Image src={course.thumbnail || "/images/image-placeholder.png"} fill />
      </Box>
      <Stack direction={"column"} gap={"2px"}>
        <OneLineTypography
          sx={{ fontSize: "1rem", maxWidth: "100%", fontWeight: 600 }}
          variant="body1"
        >
          {course.title}
        </OneLineTypography>
        <OneLineTypography
          sx={{ opacity: 0.6, maxWidth: "100%", fontSize: "0.75rem" }}
          variant="body1"
        >
          {course.instructor[0].name}
        </OneLineTypography>
      </Stack>
    </Stack>
  );
}

// Number of skeleton items to show while loading
const SKELETON_COUNT = 3;

function SearchResultSkeleton() {
  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 1,
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "row",
        boxShadow: 3,
        py: 1,
        borderRadius: 1,
      }}
    >
      <List sx={{ width: "100%", p: 0, bgcolor: "background.paper" }}>
        {Array(SKELETON_COUNT)
          .fill(0)
          .map((_, index) => (
            <ListItemButton
              key={`skeleton-${index}`}
              sx={{ cursor: "default" }}
            >
              <Stack
                sx={{ width: 1 }}
                direction={"row"}
                gap={1}
                alignItems={"flex-start"}
              >
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: 1,
                  }}
                />
                <Stack
                  direction={"column"}
                  gap={"2px"}
                  width="calc(100% - 50px)"
                >
                  <Skeleton width="70%" height={24} />
                  <Skeleton width="40%" height={18} />
                </Stack>
              </Stack>
            </ListItemButton>
          ))}
      </List>
    </Box>
  );
}
