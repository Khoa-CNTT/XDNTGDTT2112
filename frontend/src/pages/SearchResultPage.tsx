import Section from "@/components/common/Section";
import SearchResult from "@/components/search-result/SearchResult";
import { getCoursesByQuery } from "@/services/courseService";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query");

  const { data: res, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => getCoursesByQuery(query as string),
  });

  const data = res?.data || [];

  return (
    <>
      <Section sx={{ mt: "128px", mb: "64px" }}>
        <Typography variant="h4" component="h1" gutterBottom mb={3}>
          Kết quả tìm kiếm
        </Typography>
        <SearchResult data={data} isLoading={isLoading} />
      </Section>
    </>
  );
}
