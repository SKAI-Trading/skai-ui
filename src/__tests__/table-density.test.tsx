/**
 * `Table density` and `Table layout` — the Orders-table column hand-off.
 *
 * ── Why the primitive changed ─────────────────────────────────────────────
 *
 * The wave 52 trade-perp lane rebuilt the perps Orders tab against board
 * 4020:47586 and left one item open: the board places ten columns at fixed
 * widths (158 / 100 / 140 / 115 / 100 / 90 / 120 / 150 / 100 / 164) inside a
 * 1334 table on a 12 inset, with the 73 of slack spread as a flat 8.11 gutter,
 * and the shared table could not be asked for either half of that.
 *
 *   - It shipped `table-layout: auto`, so a `w-[158px]` on a header cell was a
 *     hint the browser re-weighed against the longest cell in the column.
 *   - It shipped `p-4` on every cell, i.e. a 16 gutter per side where the board
 *     draws about 4, and `p-4` is not displaced by a `px-*` override, so a
 *     consumer trying to tighten one axis kept the other.
 *   - The header band shipped `h-12` where all six boards of that band draw a
 *     16-tall label row with its 1px rule 8 below — 24, first row at 32.
 *
 * `density="compact"` and `layout="fixed"` are those three, and the defaults
 * are untouched so the other consumers of this table do not move.
 *
 * Every assertion has its negative twin: a table that hardcoded the compact
 * rhythm would pass half of this file.
 */

import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TABLE_CELL_PADDING_X,
  type TableDensity,
} from "../components/data-display/table";

function renderTable(props: { density?: TableDensity; layout?: "auto" | "fixed" } = {}, cellClass?: string) {
  const { container } = render(
    <Table {...props}>
      <TableHeader>
        <TableRow>
          <TableHead>Trading pairs</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className={cellClass}>BTC-USD</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  return {
    table: container.querySelector("table") as HTMLTableElement,
    th: container.querySelector("th") as HTMLTableCellElement,
    td: container.querySelector("td") as HTMLTableCellElement,
  };
}

describe("Table — the shipped rhythm is unchanged by default", () => {
  it("keeps the 48 header band and the 16 cell gutter", () => {
    const { th, td } = renderTable();

    expect(th.className).toContain("h-12");
    expect(th.className).toContain("px-4");
    expect(td.className).toContain("px-4");
    expect(td.className).toContain("py-4");

    // The negative twin: nothing compact leaks into the default.
    expect(th.className).not.toContain("h-6");
    expect(td.className).not.toContain("py-0.5");
  });

  it("splits the cell's padding into two axes so one can be overridden", () => {
    const { td } = renderTable({}, "px-3");

    // `p-4` would have survived this and kept the 16 vertical.
    expect(td.className).not.toMatch(/\bp-4\b/);
    expect(td.className).toContain("px-3");
    expect(td.className).not.toContain("px-4");
    expect(td.className).toContain("py-4");
  });

  it("is table-auto unless asked otherwise", () => {
    const { table } = renderTable();
    expect(table.className).toContain("table-auto");
    expect(table.className).not.toContain("table-fixed");
  });
});

describe("Table density='compact' — the trade band's rhythm", () => {
  it("drops the header band to the boards' 24", () => {
    const { th } = renderTable({ density: "compact" });

    expect(th.className).toContain("h-6");
    expect(th.className).toContain("px-1");
    expect(th.className).not.toContain("h-12");
    expect(th.className).not.toContain("px-4");
  });

  it("draws the cell at the board's py-0.5 over a 4 gutter", () => {
    const { td } = renderTable({ density: "compact" });

    expect(td.className).toContain("px-1");
    expect(td.className).toContain("py-0.5");
    expect(td.className).not.toContain("px-4");
    expect(td.className).not.toContain("py-4");
  });

  it("reaches cells through context, not through a prop on every cell", () => {
    // The cells above carry no density prop of their own; this is the assertion
    // that the provider is what moved them, stated once explicitly.
    const { container } = render(
      <Table density="compact">
        <TableBody>
          <TableRow>
            <TableCell>a</TableCell>
            <TableCell>b</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const cells = Array.from(container.querySelectorAll("td"));
    expect(cells).toHaveLength(2);
    for (const cell of cells) expect(cell.className).toContain("py-0.5");
  });

  it("still loses to a className on the cell", () => {
    const { td } = renderTable({ density: "compact" }, "px-3");
    expect(td.className).toContain("px-3");
    expect(td.className).not.toContain("px-1");
  });
});

describe("Table layout='fixed' — column widths mean what they say", () => {
  it("switches the table off auto layout", () => {
    const { table } = renderTable({ layout: "fixed" });
    expect(table.className).toContain("table-fixed");
    expect(table.className).not.toContain("table-auto");
  });
});

describe("TABLE_CELL_PADDING_X — the number a column sum needs", () => {
  it("states each density's horizontal padding in px", () => {
    expect(TABLE_CELL_PADDING_X.comfortable).toBe(16);
    expect(TABLE_CELL_PADDING_X.compact).toBe(4);
  });

  it("puts two compact cells 8 apart, against the board's 8.11", () => {
    const gutter = TABLE_CELL_PADDING_X.compact * 2;
    expect(gutter).toBe(8);
    // 73 of slack over the Orders board's nine gaps. The residue is 0.11 a gap,
    // 0.99 across the row, and it is slack rather than a drawn value.
    expect(Math.abs(gutter - 73 / 9)).toBeLessThan(0.12);
  });
});
