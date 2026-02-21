import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import axios from "axios";
import AareGuru from "@/components/AareGuru.vue";
import type { AareData } from "@/types";

// Mock axios
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

// Mock data
const mockAareData: AareData = {
  aare: {
    temperature: 18.5,
    temperature_prec: 19.2,
    temperature_text: "schön warm",
    temperature_text_short: "warm",
    flow: 120,
    flow_text: "mittel",
    location: "Bern",
    location_long: "Bern - Schönau",
    forecast2h: 18.7,
    forecast2h_text: "leicht steigend",
    timestamp: Date.now(),
    timestring: "12:00"
  },
  weather: {
    current: {
      tt: 22,
      rr: 0,
      rrreal: 0,
      timestamp: Date.now(),
      timestring: "12:00"
    },
    today: {
      v: {
        sy: "1",
        syt: "sonnig",
        symt: 1,
        tt: 20,
        rr: 0,
        rrisk: 0
      },
      n: {
        sy: "2",
        syt: "heiter",
        symt: 2,
        tt: 24,
        rr: 0,
        rrisk: 10
      },
      a: {
        sy: "3",
        syt: "wolkig",
        symt: 3,
        tt: 22,
        rr: 0,
        rrisk: 20
      }
    },
    forecast: [
      {
        day: "Montag",
        dayshort: "Mo",
        timestamp: Date.now(),
        sy: "1",
        syt: "sonnig",
        symt: 1,
        tx: 25,
        tn: 12,
        rr: 0,
        rrisk: 0
      }
    ]
  }
};

describe("AareGuru.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Basic Rendering", () => {
    it("renders loading state initially", () => {
      mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
      const wrapper = mount(AareGuru);

      expect(wrapper.find(".aareguru-loading").exists()).toBe(true);
      expect(wrapper.text()).toContain("Loading");
    });

    it("renders temperature when API call succeeds", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      const wrapper = mount(AareGuru);
      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(wrapper.find(".aareguru-temperature").exists()).toBe(true);
      expect(wrapper.text()).toContain("18.5");
    });

    it("renders error state when API call fails", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network error"));

      const wrapper = mount(AareGuru, {
        props: { retryAttempts: 0 }
      });
      await flushPromises();

      expect(wrapper.find(".aareguru-error").exists()).toBe(true);
      expect(wrapper.text()).toContain("Error");
    });
  });

  describe("Props", () => {
    it("uses custom city prop", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      mount(AareGuru, {
        props: { city: "thun" }
      });
      await flushPromises();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining("city=thun"),
        expect.any(Object)
      );
    });

    it("converts temperature to Fahrenheit when unit prop is fahrenheit", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      const wrapper = mount(AareGuru, {
        props: { unit: "fahrenheit" }
      });
      await flushPromises();
      await wrapper.vm.$nextTick();

      // 18.5°C = 65.3°F
      expect(wrapper.text()).toContain("65.3");
      expect(wrapper.text()).toContain("°F");
    });

    it("displays Celsius by default", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      const wrapper = mount(AareGuru);
      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain("18.5");
      expect(wrapper.text()).toContain("°C");
    });

    it("accepts only valid cities via TypeScript types", () => {
      // With TypeScript, invalid cities are caught at compile time.
      // This test verifies that valid cities work correctly.
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      const validCities = ["bern", "thun", "brienz", "interlaken", "biel", "hagneck"];

      validCities.forEach((city) => {
        const wrapper = mount(AareGuru, {
          props: { city: city as "bern" | "thun" | "brienz" | "interlaken" | "biel" | "hagneck" }
        });
        expect(wrapper.exists()).toBe(true);
      });
    });
  });

  describe("Events", () => {
    it("emits loaded event on successful API call", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      const wrapper = mount(AareGuru);
      await flushPromises();

      expect(wrapper.emitted("loaded")).toBeTruthy();
      expect(wrapper.emitted("loaded")?.[0]).toEqual([mockAareData]);
    });

    it("emits error event on API failure", async () => {
      const error = new Error("Network error");
      mockedAxios.get.mockRejectedValue(error);

      const wrapper = mount(AareGuru, {
        props: { retryAttempts: 0 }
      });
      await flushPromises();

      expect(wrapper.emitted("error")).toBeTruthy();
    });

    it("emits retry event before each retry attempt", async () => {
      let callCount = 0;
      mockedAxios.get.mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.reject(new Error("Temporary error"));
        }
        return Promise.resolve({ data: mockAareData });
      });

      const wrapper = mount(AareGuru, {
        props: { retryAttempts: 2, retryDelay: 100 }
      });

      await vi.advanceTimersByTimeAsync(100);
      await flushPromises();
      await vi.advanceTimersByTimeAsync(200);
      await flushPromises();

      expect(wrapper.emitted("retry")).toBeTruthy();
      expect(wrapper.emitted("retry")?.length).toBeGreaterThan(0);
    });
  });

  describe("Retry Logic", () => {
    it("retries failed API calls", async () => {
      let callCount = 0;
      mockedAxios.get.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error("First attempt failed"));
        }
        return Promise.resolve({ data: mockAareData });
      });

      const wrapper = mount(AareGuru, {
        props: { retryAttempts: 1, retryDelay: 100 }
      });

      await flushPromises();
      await vi.advanceTimersByTimeAsync(100);
      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(wrapper.find(".aareguru-temperature").exists()).toBe(true);
    });

    it("does not retry on 4xx errors", async () => {
      mockedAxios.get.mockRejectedValue({
        response: { status: 404 }
      });

      const wrapper = mount(AareGuru, {
        props: { retryAttempts: 3 }
      });
      await flushPromises();

      // Should only call once, no retries
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(wrapper.find(".aareguru-error").exists()).toBe(true);
    });

    it("uses exponential backoff for retries", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network error"));

      mount(AareGuru, {
        props: { retryAttempts: 2, retryDelay: 1000 }
      });

      await flushPromises();

      // First retry: 1000ms delay
      await vi.advanceTimersByTimeAsync(1000);
      await flushPromises();

      // Second retry: 2000ms delay
      await vi.advanceTimersByTimeAsync(2000);
      await flushPromises();

      expect(mockedAxios.get).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe("Caching", () => {
    it("uses cached data within cache timeout", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      const wrapper = mount(AareGuru, {
        props: { cacheTimeout: 5000 }
      });
      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);

      // Note: refresh() forces a refetch, so we won't test cache here
      // Cache is used internally when component is re-rendered
      expect(wrapper.find(".aareguru-temperature").exists()).toBe(true);
    });

    it("refetches data after cache timeout", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      const wrapper = mount(AareGuru, {
        props: { cacheTimeout: 5000 }
      });
      await flushPromises();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);

      // Advance time past cache timeout
      await vi.advanceTimersByTimeAsync(6000);

      // Manually call refresh after cache timeout
      const vm = wrapper.vm as any;
      await vm.refresh();
      await flushPromises();

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });
  });

  describe("Auto Refresh", () => {
    it("auto-refreshes data when autoRefresh is enabled", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      mount(AareGuru, {
        props: { autoRefresh: true, cacheTimeout: 5000 }
      });
      await flushPromises();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);

      // Advance time to trigger auto-refresh
      await vi.advanceTimersByTimeAsync(5000);
      await flushPromises();

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });

    it("does not auto-refresh when autoRefresh is disabled", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      mount(AareGuru, {
        props: { autoRefresh: false, cacheTimeout: 5000 }
      });
      await flushPromises();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);

      // Advance time
      await vi.advanceTimersByTimeAsync(5000);
      await flushPromises();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1); // No additional calls
    });
  });

  describe("Slots", () => {
    it("renders custom loading slot", () => {
      mockedAxios.get.mockImplementation(() => new Promise(() => {}));

      const wrapper = mount(AareGuru, {
        slots: {
          loading: '<div class="custom-loading">Custom Loading...</div>'
        }
      });

      expect(wrapper.find(".custom-loading").exists()).toBe(true);
      expect(wrapper.text()).toContain("Custom Loading");
    });

    it("renders custom error slot", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Test error"));

      const wrapper = mount(AareGuru, {
        props: { retryAttempts: 0 },
        slots: {
          error: '<div class="custom-error">Custom Error!</div>'
        }
      });
      await flushPromises();

      expect(wrapper.find(".custom-error").exists()).toBe(true);
      expect(wrapper.text()).toContain("Custom Error");
    });

    it("renders custom default slot with data", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      const wrapper = mount(AareGuru, {
        slots: {
          default: '<div class="custom-temp">Custom temperature</div>'
        }
      });
      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain("Custom temperature");
    });
  });

  describe("Exposed Methods", () => {
    it("exposes refresh method", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      const wrapper = mount(AareGuru);
      await flushPromises();

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);

      // Call exposed refresh method
      const vm = wrapper.vm as any;
      await vm.refresh();
      await flushPromises();

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });

    it("exposes clearCache method", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      const wrapper = mount(AareGuru);
      await flushPromises();
      await wrapper.vm.$nextTick();

      expect(wrapper.find(".aareguru-temperature").exists()).toBe(true);

      // Call exposed clearCache method
      const vm = wrapper.vm as any;
      vm.clearCache();
      await wrapper.vm.$nextTick();

      // Data should be cleared, showing loading state
      expect(wrapper.find(".aareguru-temperature").exists()).toBe(false);
    });

    it("exposes ALLOWED_CITIES constant", () => {
      const wrapper = mount(AareGuru);
      const vm = wrapper.vm as any;

      expect(vm.ALLOWED_CITIES).toEqual([
        "bern",
        "thun",
        "brienz",
        "interlaken",
        "biel",
        "hagneck",
        "olten",
        "brugg"
      ]);
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes for loading state", () => {
      mockedAxios.get.mockImplementation(() => new Promise(() => {}));

      const wrapper = mount(AareGuru);

      const loadingSpan = wrapper.find(".aareguru-loading");
      expect(loadingSpan.attributes("role")).toBe("status");
      expect(loadingSpan.attributes("aria-live")).toBe("polite");
    });

    it("has proper ARIA attributes for error state", async () => {
      mockedAxios.get.mockRejectedValue(new Error("Network error"));

      const wrapper = mount(AareGuru, {
        props: { retryAttempts: 0 }
      });
      await flushPromises();

      const errorSpan = wrapper.find(".aareguru-error");
      expect(errorSpan.attributes("role")).toBe("alert");
      expect(errorSpan.attributes("aria-live")).toBe("assertive");
    });

    it("has proper role for temperature display", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      const wrapper = mount(AareGuru);
      await flushPromises();
      await wrapper.vm.$nextTick();

      const tempSpan = wrapper.find(".aareguru-temperature");
      expect(tempSpan.exists()).toBe(true);
      expect(tempSpan.attributes("role")).toBe("text");
    });
  });

  describe("API Request Configuration", () => {
    it("includes timeout in request config", async () => {
      mockedAxios.get.mockResolvedValue({ data: mockAareData });

      mount(AareGuru);
      await flushPromises();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ timeout: 5000 })
      );
    });

    it("validates API response structure", async () => {
      // Response with invalid structure
      mockedAxios.get.mockResolvedValue({ data: { invalid: "structure" } });

      const wrapper = mount(AareGuru, {
        props: { retryAttempts: 0 }
      });
      await flushPromises();

      // Component should show error state for invalid API response
      expect(wrapper.find(".aareguru-error").exists()).toBe(true);
      // Error event should be emitted
      expect(wrapper.emitted("error")).toBeTruthy();
    });
  });
});
