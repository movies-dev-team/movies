import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MovieOverview from "../components/MovieOverview";
import content from "@/data/content.json"

describe("MovieOverview", () => {

  const shortOverview = "a".repeat(150);
  const longOverview = "a".repeat(151);

  it("should render the overview heading", () => {  
    render(<MovieOverview overview={shortOverview} />);
    const heading = screen.getByRole("heading", { name: content.movieDetail.overview });
    expect(heading).toBeInTheDocument();
  });

  it("should display the overview text", () => {
    render(<MovieOverview overview={shortOverview} />);
    const text = screen.getByText(shortOverview);
    expect(text).toBeInTheDocument();
  });

  it("should not display the read more button for a short overview", () => {
    render(<MovieOverview overview={shortOverview} />);

    const button = screen.queryByRole("button", 
      { name: content.loading.readMore });

    expect(button).not.toBeInTheDocument();
  });

  it("should display the read more button for a long overview", () => {
    render(<MovieOverview overview={longOverview} />);

    const button = screen.getByRole("button", 
      { name: content.loading.readMore });

    expect(button).toBeInTheDocument();
  });

  it("should expand the overview when clicking read more", async () => {
    const user = userEvent.setup();
    render(<MovieOverview overview={longOverview} />);

    const buttonReadMore = screen.getByRole("button", 
      { name: content.loading.readMore });
    await user.click(buttonReadMore);
    const buttonReadLess = screen.getByRole("button", { 
      name: content.loading.readLess });
    const hiddenButton = screen.queryByRole("button", {
      name: content.loading.readMore });

    expect(buttonReadLess).toBeInTheDocument();
    expect(hiddenButton).not.toBeInTheDocument();
  });

  it("should collapse the overview when clicking read less", async () => {
    const user = userEvent.setup();
    render(<MovieOverview overview={longOverview} />);

    const visibleButton = screen.getByRole("button", 
      { name: content.loading.readMore });
    await user.click(visibleButton);
    const buttonReadLess = screen.getByRole("button", { 
      name: content.loading.readLess });
    await user.click(buttonReadLess);
    const hiddenButton = screen.queryByRole("button", {
      name: content.loading.readLess });
    const buttonReadMoreAgain = screen.getByRole("button", {
      name: content.loading.readMore
    });

    expect(visibleButton).toBeInTheDocument();
    expect(hiddenButton).not.toBeInTheDocument();
    expect(buttonReadMoreAgain).toBeInTheDocument();
  });
})