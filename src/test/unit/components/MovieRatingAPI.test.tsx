
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MovieRatingAPI from "@/shared/components/MovieRatingAPI";

describe("MovieRatingAPI", () => {
  it("should display the movie rating", () => {
    render(<MovieRatingAPI rating={8.5} />);

    expect(
      screen.getByText("8.5")
    ).toBeInTheDocument();
  });

  it("should display integer ratings with one decimal", () => {
    render(<MovieRatingAPI rating={8} />);

    expect(
      screen.getByText("8.0")
    ).toBeInTheDocument();
  });

  it("should round the rating to one decimal", () => {
    render(<MovieRatingAPI rating={8.76} />);

    expect(
      screen.getByText("8.8")
    ).toBeInTheDocument();
  });

  it("should display a zero rating correctly", () => {
    render(<MovieRatingAPI rating={0} />);

    expect(
      screen.getByText("0.0")
    ).toBeInTheDocument();
  });
});