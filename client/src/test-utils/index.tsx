import {
  render as rtlRender,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import { ReactElement } from "react";
import { Provider } from "react-redux";

import { configureStoreWithMiddlewares, RootState } from "../app/store";

type CustomRenderOptions = {
  preloadedState?: RootState;
  renderOptions?: Omit<RenderOptions, "wrapper">;
};
function render(
  ui: ReactElement,
  { preloadedState = {}, ...renderOptions }: CustomRenderOptions = {}
): RenderResult {
  const Wrapper: React.FC = ({ children }) => {
    const store = configureStoreWithMiddlewares(preloadedState);
    return <Provider store={store}>{children}</Provider>;
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from "@testing-library/react";
export { render };
