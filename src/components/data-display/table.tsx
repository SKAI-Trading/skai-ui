import * as React from "react";

import { cn } from "../../lib/utils";

/**
 * Cell rhythm. `comfortable` is the shadcn default this table shipped with and
 * stays the default; `compact` is the rhythm the trade band's six boards draw.
 *
 * The trade tables were each hand-rolling the compact rhythm on every cell,
 * which is how the Orders table ended up on `h-12` headers over `p-4` cells
 * while the board draws a 16-tall label row with its rule 8 below (24 in all,
 * first row at 32) over rows at `py-0.5`. Passing `density="compact"` once on
 * the `Table` sets both, and a per-cell `className` still wins over it because
 * `cn` merges with tailwind-merge.
 */
export type TableDensity = "comfortable" | "compact";

const TableDensityContext = React.createContext<TableDensity>("comfortable");

/** Horizontal cell padding per density, in px, for a consumer doing column maths. */
export const TABLE_CELL_PADDING_X: Record<TableDensity, number> = {
  comfortable: 16,
  compact: 4,
};

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  /** Cell rhythm for every `TableHead` and `TableCell` below. */
  density?: TableDensity;
  /**
   * `fixed` switches the table to `table-layout: fixed`, so a `w-[158px]` on a
   * header column is the column's real width instead of a hint the browser
   * re-weighs against content. A board that states column widths needs this;
   * without it the widths drift with the longest cell in each column.
   */
  layout?: "auto" | "fixed";
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, density = "comfortable", layout = "auto", ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <TableDensityContext.Provider value={density}>
        <table
          ref={ref}
          className={cn(
            "w-full caption-bottom text-sm",
            layout === "fixed" ? "table-fixed" : "table-auto",
            className,
          )}
          {...props}
        />
      </TableDensityContext.Provider>
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const density = React.useContext(TableDensityContext);
  return (
    <th
      ref={ref}
      className={cn(
        "text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        density === "compact" ? "h-6 px-1" : "h-12 px-4",
        className,
      )}
      {...props}
    />
  );
});
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const density = React.useContext(TableDensityContext);
  return (
    <td
      ref={ref}
      className={cn(
        "align-middle [&:has([role=checkbox])]:pr-0",
        // Kept as separate axes rather than the `p-4` this shipped with, so a
        // consumer can override one of them. tailwind-merge drops `p-4` only for
        // another `p-*`, so a cell passing `px-1` kept the 16 vertical padding
        // and the row stayed 24 too tall for a reason nothing in it named.
        density === "compact" ? "px-1 py-0.5" : "px-4 py-4",
        className,
      )}
      {...props}
    />
  );
});
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
