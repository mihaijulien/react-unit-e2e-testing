import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  TodosProvider,
  addTodo,
  initialState,
  reducer,
  useTodosContext,
} from "./todos.tsx";
import { useEffect } from "react";
import axios from "axios";

describe("TodosProvider", () => {
  it("addTodo", async () => {
    const mockResponse = {
      data: { id: "1", text: "foo", isCompleted: false },
    };
    vi.spyOn(axios, "get").mockResolvedValue({ data: [mockResponse.data] });
    vi.spyOn(axios, "post").mockResolvedValue(mockResponse);
    const TestComponent = () => {
      const [todosState, , { addTodo }] = useTodosContext();
      useEffect(() => {
        addTodo({ text: "foo", isCompleted: false });
      }, []);
      return <div data-testid="content">{todosState.todos.length}</div>;
    };
    render(
      <TodosProvider>
        <TestComponent />
      </TodosProvider>
    );

    const content = await screen.findByTestId("content");
    expect(content).toHaveTextContent("1");
    expect(axios.post).toHaveBeenCalledWith("http://localhost:3004/todos", {
      text: "foo",
      isCompleted: false,
    });
  });
});

describe("TodosContext reducer", () => {
  it("has correct default state", () => {
    const newState = reducer(initialState, {
      type: "changeFilter",
      payload: "all",
    });
    expect(newState).toEqual({
      filter: "all",
      todos: [],
    });
  });

  it("addTodo", () => {
    const newState = reducer(initialState, {
      type: "addTodo",
      payload: { id: "1", text: " foo", isCompleted: false },
    });
    expect(newState.todos[0]).toEqual({
      id: "1",
      text: " foo",
      isCompleted: false,
    });
  });

  it("toggleAll", () => {
    const oldState = {
      ...initialState,
      todos: [{ id: "1", text: "foo", isCompleted: false }],
    };
    const newState = reducer(oldState, {
      type: "toggleAll",
      payload: true,
    });
    expect(newState.todos[0].isCompleted).toEqual(true);
  });

  it("updateTodo", () => {
    const oldState = {
      ...initialState,
      todos: [{ id: "1", text: "foo", isCompleted: false }],
    };
    const newState = reducer(oldState, {
      type: "updateTodo",
      payload: { id: "1", text: "bar" },
    });
    expect(newState.todos[0].text).toEqual("bar");
  });

  it("removeTodo", () => {
    const oldState = {
      ...initialState,
      todos: [{ id: "1", text: "foo", isCompleted: false }],
    };
    const newState = reducer(oldState, {
      type: "removeTodo",
      payload: "1",
    });
    expect(newState.todos).toHaveLength(0);
  });

  it("changeFilter", () => {
    const newState = reducer(initialState, {
      type: "changeFilter",
      payload: "active",
    });
    expect(newState.filter).toEqual("active");
  });
});

describe("api", () => {
  const mockDispatch = vi.fn();
  it("addTodo", async () => {
    const mockResponse = {
      data: { id: "1", text: "foo", isCompleted: false },
    };
    vi.spyOn(axios, "post").mockResolvedValue(mockResponse);
    await addTodo(mockDispatch, { text: "foo", isCompleted: false });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "addTodo",
      payload: mockResponse.data,
    });
  });
});
