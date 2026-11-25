import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonBiography from "../components/PersonBiography";
import content from "@/data/content.json"

describe("PersonBiography", () => {

  const biography = "Matthew Paige Damon es un actor y guionista estadounidense";
  const longBiography = "a".repeat(301);

  it("should render the biography heading", () => {  
    render(<PersonBiography biography={biography} />);
    const heading = screen.getByRole("heading", { name: content.movieDetail.biography });
    expect(heading).toBeInTheDocument();
  });

  it("should display the biography text", () => {
    render(<PersonBiography biography={biography} />);
    const text = screen.getByText(biography);
    expect(text).toBeInTheDocument();
  });

  it("should display a fallback message when the biography is empty", () => {

    const emptyBiography = "";
    render(<PersonBiography biography={emptyBiography} />);
    const text = screen.getByText(content.movieDetail.biographyNotAvailable);
    expect(text).toBeInTheDocument();
  });

  it("should display a fallback message when the biography contains only spaces", () => {
    const emptyBiography = "     ";
    render(<PersonBiography biography={emptyBiography} />);

    const text = screen.getByText(content.movieDetail.biographyNotAvailable);

    expect(text).toBeInTheDocument();
  });

  it("should not display the read more button for a short biography", () => {
    render(<PersonBiography biography={biography} />);

    const button = screen.queryByRole("button", 
      { name: content.loading.readMore });

    expect(button).not.toBeInTheDocument();
  });

  it("should display the read more button for a long biography", () => {
    render(<PersonBiography biography={longBiography} />);

    const button = screen.getByRole("button", 
      { name: content.loading.readMore });

    expect(button).toBeInTheDocument();
  });

  it("should expand the biography when clicking read more", async () => {
    const user = userEvent.setup();
    render(<PersonBiography biography={longBiography} />);

    const buttonReadMore = screen.getByRole("button", 
      { name: content.loading.readMore });
    await user.click(buttonReadMore);
    const buttonReadLess = screen.queryByRole("button", { 
      name: content.loading.readLess });
    const hiddenButton = screen.queryByRole("button", {
      name: content.loading.readMore });

    expect(buttonReadLess).toBeInTheDocument();
    expect(hiddenButton).not.toBeInTheDocument();
  });

  it("should collapse the biography when clicking read less", async () => {
    const user = userEvent.setup();
    render(<PersonBiography biography={longBiography} />);

    const visibleButton = screen.getByRole("button", 
      { name: content.loading.readMore });
    await user.click(visibleButton);
    const buttonReadLess = screen.getByRole("button", { 
      name: content.loading.readLess });
    await user.click(buttonReadLess);
    const hiddenButton = screen.queryByRole("button", {
      name: content.loading.readLess });

    expect(visibleButton).toBeInTheDocument();
    expect(hiddenButton).not.toBeInTheDocument();
  });
})