import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { page } from "vitest/browser";
import axios from "axios";
import AareGuru from "@/components/AareGuru.vue";
import type { AareData } from "@/types";

// Axios is mocked exactly like the happy-dom unit suite — no real network
// requests hit the Aareguru API from the browser.
vi.mock("axios");
const mockedAxios = vi.mocked(axios, true);

function makeAareData(temperature: number, location: string): AareData {
  return {
    aare: {
      temperature,
      temperature_prec: temperature + 0.7,
      temperature_text: "schön warm",
      temperature_text_short: "warm",
      flow: 120,
      flow_text: "mittel",
      location,
      location_long: `${location} - Schönau`,
      forecast2h: temperature + 0.2,
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
        v: { sy: "1", syt: "sonnig", symt: 1, tt: 20, rr: 0, rrisk: 0 },
        n: { sy: "2", syt: "heiter", symt: 2, tt: 24, rr: 0, rrisk: 10 },
        a: { sy: "3", syt: "wolkig", symt: 3, tt: 22, rr: 0, rrisk: 20 }
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
}

const bernData = makeAareData(18.5, "Bern");
const thunData = makeAareData(21.3, "Thun");

describe("AareGuru.vue (real browser)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the temperature visibly in a real DOM after load", async () => {
    mockedAxios.get.mockResolvedValue({ data: bernData });

    const wrapper = mount(AareGuru, { attachTo: document.body });
    await flushPromises();
    await wrapper.vm.$nextTick();

    // expect.element retries until the element is actually painted/visible.
    await expect.element(page.getByText("18.5°C")).toBeVisible();

    wrapper.unmount();
  });

  it("transitions from a visible loading state to the success state", async () => {
    let resolveGet!: (value: { data: AareData }) => void;
    mockedAxios.get.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveGet = resolve;
        })
    );

    const wrapper = mount(AareGuru, { attachTo: document.body });
    await wrapper.vm.$nextTick();

    // Loading text is genuinely rendered and visible before data arrives.
    await expect.element(page.getByText("Loading...")).toBeVisible();

    resolveGet({ data: bernData });
    await flushPromises();
    await wrapper.vm.$nextTick();

    await expect.element(page.getByText("18.5°C")).toBeVisible();
    expect(wrapper.find(".aareguru-loading").exists()).toBe(false);

    wrapper.unmount();
  });

  it("reactively re-renders when the city prop changes", async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes("city=thun")) {
        return Promise.resolve({ data: thunData });
      }
      return Promise.resolve({ data: bernData });
    });

    const wrapper = mount(AareGuru, {
      attachTo: document.body,
      props: { city: "bern" as const }
    });
    await flushPromises();
    await wrapper.vm.$nextTick();

    await expect.element(page.getByText("18.5°C")).toBeVisible();

    await wrapper.setProps({ city: "thun" as const });
    await flushPromises();
    await wrapper.vm.$nextTick();

    await expect.element(page.getByText("21.3°C")).toBeVisible();

    wrapper.unmount();
  });

  it("shows the Fahrenheit value and unit class in the rendered output", async () => {
    mockedAxios.get.mockResolvedValue({ data: bernData });

    const wrapper = mount(AareGuru, {
      attachTo: document.body,
      props: { unit: "fahrenheit" as const }
    });
    await flushPromises();
    await wrapper.vm.$nextTick();

    // 18.5°C = 65.3°F
    await expect.element(page.getByText("65.3°F")).toBeVisible();
    expect(wrapper.find(".aareguru-temperature").classes()).toContain("fahrenheit");

    wrapper.unmount();
  });

  it("renders custom default slot content in the browser", async () => {
    mockedAxios.get.mockResolvedValue({ data: bernData });

    const wrapper = mount(AareGuru, {
      attachTo: document.body,
      slots: {
        default: '<strong class="custom-temp">Aare is great</strong>'
      }
    });
    await flushPromises();
    await wrapper.vm.$nextTick();

    await expect.element(page.getByText("Aare is great")).toBeVisible();

    wrapper.unmount();
  });
});
