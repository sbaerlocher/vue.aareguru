import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { useHistory } from "@/composables/useHistory";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

const mockHistoryResponse = {
  status: "success",
  city: "bern",
  start: "2026-02-20",
  end: "2026-02-21",
  data: {
    temperature: [
      [1740000000, 15.2],
      [1740003600, 15.5],
      [1740007200, 16.1]
    ],
    flow: [
      [1740000000, 120],
      [1740003600, 125],
      [1740007200, 118]
    ]
  }
};

describe("useHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with null data and no loading state", () => {
    const { data, isLoading, error } = useHistory("bern");

    expect(data.value).toBeNull();
    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("fetches history data with default parameters", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockHistoryResponse });

    const { data, fetch: fetchHistory, isLoading } = useHistory("bern");

    await fetchHistory();

    expect(isLoading.value).toBe(false);
    expect(data.value).not.toBeNull();
    expect(data.value?.city).toBe("bern");
    expect(data.value?.temperature).toHaveLength(3);
    expect(data.value?.flow).toHaveLength(3);
  });

  it("calls API with correct URL and parameters", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockHistoryResponse });

    const { fetch: fetchHistory } = useHistory("thun");

    await fetchHistory("2026-01-01", "2026-01-31");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://aareguru.existenz.ch/v2018/history?city=thun&start=2026-01-01&end=2026-01-31&app=vue.aareguru",
      expect.objectContaining({ timeout: 10000 })
    );
  });

  it("uses default start and end parameters", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockHistoryResponse });

    const { fetch: fetchHistory } = useHistory("bern");

    await fetchHistory();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("start=yesterday&end=now"),
      expect.any(Object)
    );
  });

  it("parses temperature data points correctly", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockHistoryResponse });

    const { data, fetch: fetchHistory } = useHistory("bern");

    await fetchHistory();

    expect(data.value?.temperature[0]).toEqual({
      timestamp: 1740000000,
      value: 15.2
    });
    expect(data.value?.temperature[2]).toEqual({
      timestamp: 1740007200,
      value: 16.1
    });
  });

  it("parses flow data points correctly", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockHistoryResponse });

    const { data, fetch: fetchHistory } = useHistory("bern");

    await fetchHistory();

    expect(data.value?.flow[0]).toEqual({
      timestamp: 1740000000,
      value: 120
    });
  });

  it("handles API errors", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network error"));

    const { data, error, fetch: fetchHistory } = useHistory("bern");

    await fetchHistory();

    expect(error.value).toBeInstanceOf(Error);
    expect(error.value?.message).toBe("Network error");
    expect(data.value).toBeNull();
  });

  it("handles non-Error rejection values", async () => {
    mockedAxios.get.mockRejectedValue("string error");

    const { error, fetch: fetchHistory } = useHistory("bern");

    await fetchHistory();

    expect(error.value).toBeInstanceOf(Error);
    expect(error.value?.message).toBe("string error");
  });

  it("handles missing data fields gracefully", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {}
      }
    });

    const { data, fetch: fetchHistory } = useHistory("bern");

    await fetchHistory();

    expect(data.value?.temperature).toEqual([]);
    expect(data.value?.flow).toEqual([]);
  });

  it("handles malformed data points (less than 2 elements)", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: {
          temperature: [[1740000000], [1740003600, 15.5]],
          flow: []
        }
      }
    });

    const { data, fetch: fetchHistory } = useHistory("bern");

    await fetchHistory();

    // Only the valid point should be parsed
    expect(data.value?.temperature).toHaveLength(1);
    expect(data.value?.temperature[0]?.value).toBe(15.5);
  });

  it("clears previous data on error", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockHistoryResponse });

    const { data, error, fetch: fetchHistory } = useHistory("bern");

    // First fetch succeeds
    await fetchHistory();
    expect(data.value).not.toBeNull();

    // Second fetch fails
    mockedAxios.get.mockRejectedValue(new Error("Server error"));
    await fetchHistory();

    expect(data.value).toBeNull();
    expect(error.value?.message).toBe("Server error");
  });

  it("clears error on successful fetch after failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network error"));

    const { error, fetch: fetchHistory } = useHistory("bern");

    await fetchHistory();
    expect(error.value).toBeInstanceOf(Error);

    // Now succeed
    mockedAxios.get.mockResolvedValue({ data: mockHistoryResponse });
    await fetchHistory();

    expect(error.value).toBeNull();
  });

  it("returns readonly refs that cannot be mutated", () => {
    const { data, isLoading, error } = useHistory("bern");

    const originalData = data.value;
    const originalLoading = isLoading.value;
    const originalError = error.value;

    // Readonly refs silently reject mutations (Vue warns but doesn't throw)
    // @ts-expect-error - testing readonly enforcement
    data.value = { fake: true };
    // @ts-expect-error - testing readonly enforcement
    isLoading.value = true;
    // @ts-expect-error - testing readonly enforcement
    error.value = new Error("test");

    // Values should remain unchanged
    expect(data.value).toBe(originalData);
    expect(isLoading.value).toBe(originalLoading);
    expect(error.value).toBe(originalError);
  });

  it("sets isLoading during fetch", async () => {
    let resolvePromise: (value: unknown) => void;
    mockedAxios.get.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    const { isLoading, fetch: fetchHistory } = useHistory("bern");

    const fetchPromise = fetchHistory();

    expect(isLoading.value).toBe(true);

    resolvePromise!({ data: mockHistoryResponse });
    await fetchPromise;

    expect(isLoading.value).toBe(false);
  });
});
