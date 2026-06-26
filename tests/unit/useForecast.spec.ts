import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { useForecast } from "@/composables/useForecast";

vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

const mockPeriod = {
  sy: "a",
  syt: "sunny",
  symt: 1,
  tt: 20,
  rr: 0,
  rrisk: 5
};

const mockCurrentResponse = {
  aare: {
    temperature: 18.5,
    location: "bern"
  },
  weather: {
    current: {
      tt: 22,
      rr: 0,
      rrreal: 0,
      timestamp: 1740000000,
      timestring: "2026-02-20T12:00:00+01:00"
    },
    today: {
      v: mockPeriod,
      n: { ...mockPeriod, tt: 24 },
      a: { ...mockPeriod, tt: 19 }
    },
    forecast: [
      {
        day: "Freitag",
        dayshort: "Fr",
        timestamp: 1740086400,
        sy: "a",
        syt: "sunny",
        symt: 1,
        tx: 25,
        tn: 12,
        rr: 0,
        rrisk: 10
      },
      {
        day: "Samstag",
        dayshort: "Sa",
        timestamp: 1740172800,
        sy: "b",
        syt: "cloudy",
        symt: 2,
        tx: 21,
        tn: 11,
        rr: 2,
        rrisk: 40
      }
    ]
  }
};

describe("useForecast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with null data and no loading state", () => {
    const { data, isLoading, error } = useForecast("bern");

    expect(data.value).toBeNull();
    expect(isLoading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("fetches forecast data", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCurrentResponse });

    const { data, fetch: fetchForecast, isLoading } = useForecast("bern");

    await fetchForecast();

    expect(isLoading.value).toBe(false);
    expect(data.value).not.toBeNull();
    expect(data.value?.city).toBe("bern");
    expect(data.value?.forecast).toHaveLength(2);
    expect(data.value?.today).not.toBeNull();
  });

  it("calls API with correct URL and parameters", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCurrentResponse });

    const { fetch: fetchForecast } = useForecast("thun");

    await fetchForecast();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://aareguru.existenz.ch/v2018/current?city=thun&app=vue.aareguru",
      expect.objectContaining({ timeout: 10000 })
    );
  });

  it("parses forecast day entries correctly", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCurrentResponse });

    const { data, fetch: fetchForecast } = useForecast("bern");

    await fetchForecast();

    expect(data.value?.forecast[0]).toMatchObject({
      dayshort: "Fr",
      tx: 25,
      tn: 12,
      timestamp: 1740086400
    });
    expect(data.value?.forecast[1]?.syt).toBe("cloudy");
  });

  it("exposes today breakdown by period", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCurrentResponse });

    const { data, fetch: fetchForecast } = useForecast("bern");

    await fetchForecast();

    expect(data.value?.today?.v.tt).toBe(20);
    expect(data.value?.today?.n.tt).toBe(24);
    expect(data.value?.today?.a.tt).toBe(19);
  });

  it("handles missing weather field gracefully", async () => {
    mockedAxios.get.mockResolvedValue({ data: { aare: {} } });

    const { data, fetch: fetchForecast } = useForecast("bern");

    await fetchForecast();

    expect(data.value?.forecast).toEqual([]);
    expect(data.value?.today).toBeNull();
  });

  it("handles missing forecast array gracefully", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { weather: { today: null } }
    });

    const { data, fetch: fetchForecast } = useForecast("bern");

    await fetchForecast();

    expect(data.value?.forecast).toEqual([]);
    expect(data.value?.today).toBeNull();
  });

  it("handles API errors", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network error"));

    const { data, error, fetch: fetchForecast } = useForecast("bern");

    await fetchForecast();

    expect(error.value).toBeInstanceOf(Error);
    expect(error.value?.message).toBe("Network error");
    expect(data.value).toBeNull();
  });

  it("handles non-Error rejection values", async () => {
    mockedAxios.get.mockRejectedValue("string error");

    const { error, fetch: fetchForecast } = useForecast("bern");

    await fetchForecast();

    expect(error.value).toBeInstanceOf(Error);
    expect(error.value?.message).toBe("string error");
  });

  it("clears previous data on error", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockCurrentResponse });

    const { data, error, fetch: fetchForecast } = useForecast("bern");

    await fetchForecast();
    expect(data.value).not.toBeNull();

    mockedAxios.get.mockRejectedValue(new Error("Server error"));
    await fetchForecast();

    expect(data.value).toBeNull();
    expect(error.value?.message).toBe("Server error");
  });

  it("clears error on successful fetch after failure", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network error"));

    const { error, fetch: fetchForecast } = useForecast("bern");

    await fetchForecast();
    expect(error.value).toBeInstanceOf(Error);

    mockedAxios.get.mockResolvedValue({ data: mockCurrentResponse });
    await fetchForecast();

    expect(error.value).toBeNull();
  });

  it("returns readonly refs that cannot be mutated", () => {
    const { data, isLoading, error } = useForecast("bern");

    const originalData = data.value;
    const originalLoading = isLoading.value;
    const originalError = error.value;

    // @ts-expect-error - testing readonly enforcement
    data.value = { fake: true };
    // @ts-expect-error - testing readonly enforcement
    isLoading.value = true;
    // @ts-expect-error - testing readonly enforcement
    error.value = new Error("test");

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

    const { isLoading, fetch: fetchForecast } = useForecast("bern");

    const fetchPromise = fetchForecast();

    expect(isLoading.value).toBe(true);

    resolvePromise!({ data: mockCurrentResponse });
    await fetchPromise;

    expect(isLoading.value).toBe(false);
  });
});
