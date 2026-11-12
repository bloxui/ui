import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@blox-ui/ui";

export default function BreadcrumbExample() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Components</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
