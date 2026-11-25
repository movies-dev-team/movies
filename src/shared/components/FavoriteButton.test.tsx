import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { toast } from "sonner";
import FavoriteButton from "./FavoriteButton";
import content from "@/data/content.json";
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext";

vi.mock("@/features/favorites/hooks/useFavoritesContext", () => ({
  useFavoritesContext: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

const toggleFavorite = vi.fn().mockResolvedValue(undefined);

const mockContext = {
  favorites: [],
  loading: false,
  error: null,
  updatingIds: [],
  isFavorite: vi.fn(),
  toggleFavorite,
};

describe("FavoriteButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useFavoritesContext).mockReturnValue({
      ...mockContext,
      isFavorite: vi.fn().mockReturnValue(false),
    });
  });

  it("renders the button to add a favorite", () => {
    render(<FavoriteButton movieId={1} />);

    const button = screen.getByRole("button", {
      name: content.favorites.addLabel,
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("renders the button to remove a favorite", () => {
    vi.mocked(useFavoritesContext).mockReturnValue({
      ...mockContext,
      isFavorite: vi.fn().mockReturnValue(true),
    });

    render(<FavoriteButton movieId={1} />);

    const button = screen.getByRole("button", {
      name: content.favorites.removeLabel,
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("adds a movie to favorites", async () => {
    render(<FavoriteButton movieId={1} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: content.favorites.addLabel,
      }),
    );

    expect(toggleFavorite).toHaveBeenCalledWith(1);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(content.favorites.added);
    });
  });

  it("removes a movie from favorites", async () => {
    vi.mocked(useFavoritesContext).mockReturnValue({
      ...mockContext,
      isFavorite: vi.fn().mockReturnValue(true),
    });

    render(<FavoriteButton movieId={1} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: content.favorites.removeLabel,
      }),
    );

    expect(toggleFavorite).toHaveBeenCalledWith(1);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(content.favorites.removed);
    });
  });

  it("disables the button while updating", () => {
    vi.mocked(useFavoritesContext).mockReturnValue({
      ...mockContext,
      updatingIds: [1],
    });

    render(<FavoriteButton movieId={1} />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not toggle favorites while updating", () => {
    vi.mocked(useFavoritesContext).mockReturnValue({
      ...mockContext,
      updatingIds: [1],
    });

    render(<FavoriteButton movieId={1} />);

    fireEvent.click(screen.getByRole("button"));

    expect(toggleFavorite).not.toHaveBeenCalled();
  });
});
