import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import Tags from "./Tags.jsx";
import axios from "axios";

describe("Tags", () => {

    it("renders tags", async () => {

        const mockResponse = {
            data: [{id: '1', name: 'bar'}],
        };

        vi.spyOn(axios, "get").mockResolvedValue(mockResponse);

        render(<Tags />);
        const tags = await screen.findAllByTestId("tag");
        expect(tags).toHaveLength(1);
        expect(tags[0]).toHaveTextContent("bar");
    });
});
