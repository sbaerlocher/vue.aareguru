import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { useCities } from "@/composables/useCities";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

const mockCitiesResponse = [
  {
    city: "bern",
    name: "Bern",
    longname: "Bern - Schönau",
    coordinates: { lat: 46.9481, lon: 7.4474 },
    aare: 18.5,
    aare_prec: 19.2,
    forecast: true
  },
  {
    city: "thun",
    name: "Thun",
    longname: "Thun - Schwäbis",
    coordinates: { lat: 46.7512, lon: 7.6217 },
    aare: 17.3,
    aare_prec: 18.1,
    forecast: true
  }
];

describe("useCities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches cities on initialization", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCitiesResponse });

    const { cities, isLoading } = useCities();

    // Initially loading
    expect(isLoading.value).toBe(true);

    // Wait for fetch to complete
    await vi.waitFor(() => {
      expect(isLoading.value).toBe(false);
    });

    expect(cities.value).toHaveLength(2);
    expect(cities.value[0]?.city).toBe("bern");
    expect(cities.value[1]?.city).toBe("thun");
  });

  it("calls the correct API endpoint", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCitiesResponse });

    useCities();

    await vi.waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://aareguru.existenz.ch/v2018/cities?app=vue.aareguru",
      expect.objectContaining({ timeout: 5000 })
    );
  });

  it("sets error on API failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network error"));

    const { error, isLoading } = useCities();

    await vi.waitFor(() => {
      expect(isLoading.value).toBe(false);
    });

    expect(error.value).toBeInstanceOf(Error);
    expect(error.value?.message).toBe("Network error");
  });

  it("handles non-Error rejection values", async () => {
    mockedAxios.get.mockRejectedValue("string error");

    const { error, isLoading } = useCities();

    await vi.waitFor(() => {
      expect(isLoading.value).toBe(false);
    });

    expect(error.value).toBeInstanceOf(Error);
    expect(error.value?.message).toBe("string error");
  });

  it("handles non-array response data gracefully", async () => {
    mockedAxios.get.mockResolvedValue({ data: { not: "an array" } });

    const { cities, isLoading } = useCities();

    await vi.waitFor(() => {
      expect(isLoading.value).toBe(false);
    });

    expect(cities.value).toHaveLength(0);
  });

  it("maps city data with missing coordinates to defaults", async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          city: "bern",
          name: "Bern",
          longname: "Bern - Schönau",
          aare: 18.5,
          aare_prec: 19.2,
          forecast: true
        }
      ]
    });

    const { cities, isLoading } = useCities();

    await vi.waitFor(() => {
      expect(isLoading.value).toBe(false);
    });

    expect(cities.value[0]?.coordinates.lat).toBe(0);
    expect(cities.value[0]?.coordinates.lon).toBe(0);
  });

  it("refresh fetches cities again", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCitiesResponse });

    const { refresh, isLoading } = useCities();

    await vi.waitFor(() => {
      expect(isLoading.value).toBe(false);
    });

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    // Refresh should fetch again
    await refresh();

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });

  it("returns readonly refs that cannot be mutated", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCitiesResponse });

    const { cities, isLoading, error } = useCities();

    await vi.waitFor(() => {
      expect(isLoading.value).toBe(false);
    });

    const originalCities = cities.value;
    const originalLoading = isLoading.value;
    const originalError = error.value;

    // Readonly refs silently reject mutations (Vue warns but doesn't throw)
    // @ts-expect-error - testing readonly enforcement
    cities.value = [];
    // @ts-expect-error - testing readonly enforcement
    isLoading.value = true;
    // @ts-expect-error - testing readonly enforcement
    error.value = new Error("test");

    // Values should remain unchanged
    expect(cities.value).toBe(originalCities);
    expect(isLoading.value).toBe(originalLoading);
    expect(error.value).toBe(originalError);
  });

  it("clears error on successful refresh after failure", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    const { error, refresh, isLoading } = useCities();

    await vi.waitFor(() => {
      expect(isLoading.value).toBe(false);
    });

    expect(error.value).toBeInstanceOf(Error);

    // Now succeed
    mockedAxios.get.mockResolvedValue({ data: mockCitiesResponse });
    await refresh();

    expect(error.value).toBeNull();
  });
});
