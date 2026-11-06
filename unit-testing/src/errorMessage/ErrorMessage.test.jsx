import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage.jsx";

describe("ErrorMessage", () => {
    it("renders default error state", () => {
        render(<ErrorMessage />);
        //debug
        screen.debug();

        expect(screen.getByTestId("message-container")).toHaveTextContent("Something went wrong");
    })

    it("renders custom error state", () => {
        render(<ErrorMessage message="Email is required" />);
        expect(screen.getByTestId("message-container")).toHaveTextContent("Email is required");
    })
})