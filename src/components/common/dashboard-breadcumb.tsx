"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Fragment } from "react/jsx-runtime";
import { usePathname } from "next/navigation";

export default function DashboardBreadcrumb() {
  const pathname = usePathname();

  const allPaths = pathname.split("/").filter((p) => p !== "");
  const paths = allPaths.filter((p) => p.toLowerCase() !== "admin");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {paths.map((path, index) => {
          const originalIndex = allPaths.indexOf(path);
          const url = `/${allPaths.slice(0, originalIndex + 1).join("/")}`;

          const isLast = index === paths.length - 1;

          return (
            <Fragment key={`path-${path}-${index}`}>
              <BreadcrumbItem className="capitalize">
                {!isLast ? (
                  <BreadcrumbLink
                    render={<Link href={url}>{path.replace("-", " ")}</Link>}
                  />
                ) : (
                  <BreadcrumbPage>{path.replace("-", " ")}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
