import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import Tags from "./Tags.jsx";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

describe("Tags", () => {
    const server = setupServer(
        http.get('http://localhost:3004/tags', () => {
            return HttpResponse.json([{id: '1', name: 'bar'}]);
        })
    );
    const originalAxiosAdapter = axios.defaults.adapter;
    beforeAll(() => {
        axios.defaults.adapter = "fetch";
        server.listen({ onUnhandledRequest: "error" });
    });
    afterAll(() => {
        server.close();
        axios.defaults.adapter = originalAxiosAdapter;
    });
    afterEach(() => server.resetHandlers());

    it("renders tags", async () => {
        render(<Tags />);
        const tags = await screen.findAllByTestId("tag");
        expect(tags).toHaveLength(1);
        expect(tags[0]).toHaveTextContent("bar");
    });
});
