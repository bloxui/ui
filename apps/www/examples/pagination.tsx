"use client";

import * as React from "react";
import { Pagination } from "@blox-ui/ui";

export default function PaginationExample() {
  const [page, setPage] = React.useState(6);
  return <Pagination page={page} count={20} onPageChange={setPage} />;
}
