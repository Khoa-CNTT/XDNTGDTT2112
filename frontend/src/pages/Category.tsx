import Section from "@/components/common/Section";
import SearchResult from "@/components/search-result/SearchResult";
import { getCategoryBySlug } from "@/services/categoryService";
import { getCoursesByCategoryId } from "@/services/courseService";
import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function SearchResultPage() {
  const { categorySlug1, categorySlug2 } = useParams();

  const { data: resData } = useQuery({
    queryKey: ["category", categorySlug1, categorySlug2],
    queryFn: () => getCategoryBySlug(categorySlug1 || "", categorySlug2),
  });

  const category = resData?.data;

  const { data: res, isLoading } = useQuery({
    queryKey: ["courses", category?._id],
    queryFn: () => getCoursesByCategoryId(category?._id || ""),
    enabled: !!category?._id,
  });

  const data = res?.data || [];

  return (
    <>
      <Section sx={{ mt: "128px", mb: "64px" }}>
        <Typography variant="h4" component="h1" gutterBottom mb={3}>
          Khoá học dành cho{" "}
          <Typography variant="h4" component="span" fontWeight={600}>
            "{category?.name}"
          </Typography>
        </Typography>
        <SearchResult data={data} isLoading={isLoading} />
      </Section>
    </>
  );
}
