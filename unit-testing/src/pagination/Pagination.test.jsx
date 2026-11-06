import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Pagination from "./Pagination.jsx";
import userEvent from "@testing-library/user-event";


describe("Pagination", () => {
    it("renders correct pagination", () => {
        render(<Pagination total={50} limit={10} currentPage={1}/>);
        //screen.debug();

        expect(screen.getAllByTestId("page-container")).toHaveLength(5);
        expect(screen.getAllByTestId("page-container")[0]).toHaveTextContent("1");
    });

    it("should emit clicked page", async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(
            <Pagination
                total={50}
                limit={10}
                currentPage={1}
                selectPage={handleClick}
            />
        );
        const pageContainers = screen.getAllByTestId("page-container");
        await user.click(pageContainers[0]);

        expect(handleClick).toHaveBeenCalledOnce();
    })
});