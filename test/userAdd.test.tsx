import { renderHook, act } from "@testing-library/react-hooks";
import { getSubmawil } from "@/lib/actions/users";
import { useCallback, useState } from "react";
import { TSubmawil } from "@/types";
import { jest } from "@jest/globals";

jest.mock("@/lib/actions/users", () => ({
  getSubmawil: jest.fn(),
}));

describe("tryGetSubMawil", () => {
  const mockToken = "mockToken";
  const mockUserdata = { mawil: "1" };
  const mockSubMawil: TSubmawil[] | never[] = [
    { id: "1", nama_submawil: "SubMawil1" },
  ];

  beforeEach(() => {
    (getSubmawil as jest.Mock).mockClear();
  });

  it("should fetch submawils and update state on success", async () => {
    (getSubmawil as jest.Mock).mockResolvedValue(mockSubMawil);

    const { result, waitForNextUpdate } = renderHook(() => {
      const [subMawils, setSubMawils] = useState<TSubmawil[]>([]);
      const tryGetSubMawil = useCallback(async () => {
        const newSubMawil = await getSubmawil(
          mockToken,
          Number(mockUserdata.mawil)
        );
        setSubMawils(newSubMawil);
      }, []);

      return { subMawils, tryGetSubMawil };
    });

    act(() => {
      result.current.tryGetSubMawil();
    });

    await waitForNextUpdate();

    expect(result.current.subMawils).toEqual(mockSubMawil);
    expect(getSubmawil).toHaveBeenCalledWith(
      mockToken,
      Number(mockUserdata.mawil)
    );
  });

  it("should handle error when fetching submawils", async () => {
    const error = new Error("Failed to fetch submawils");
    (getSubmawil as jest.Mock).mockRejectedValue(error);

    const { result, waitForNextUpdate } = renderHook(() => {
      const [subMawils, setSubMawils] = useState<TSubmawil[]>([]);
      const tryGetSubMawil = useCallback(async () => {
        try {
          const newSubMawil = await getSubmawil(
            mockToken,
            Number(mockUserdata.mawil)
          );
          setSubMawils(newSubMawil);
        } catch (e) {
          console.error(e);
        }
      }, []);

      return { subMawils, tryGetSubMawil };
    });

    act(() => {
      result.current.tryGetSubMawil();
    });

    await waitForNextUpdate();

    expect(result.current.subMawils).toEqual([]);
    expect(getSubmawil).toHaveBeenCalledWith(
      mockToken,
      Number(mockUserdata.mawil)
    );
  });
});
