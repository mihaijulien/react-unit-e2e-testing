import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Username from "./Username.jsx";
import userEvent from "@testing-library/user-event";

describe("Username", () => {
    it("renders default empty text (from the useStatue)", () => {
        render(<Username />);
        expect(screen.getByTestId("username")).toHaveTextContent("");
    });

    it("renders \"bar\" when clicking the button", async () => {
        render(<Username />);
        const user = userEvent.setup();
        await user.click(screen.getByTestId("button"))
        expect(screen.getByTestId("username")).toHaveTextContent("bar");
    });

    it("renders custom text when changing the input", async () => {
        render(<Username />);
        const user = userEvent.setup();
        await user.type(screen.getByTestId("username-input"), "foo")
        expect(screen.getByTestId("username")).toHaveTextContent("foo");
    });
});