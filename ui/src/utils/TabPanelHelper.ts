import _ from 'lodash';

export module TabPanelHelper {
  interface ChildProps {
      props?: JSX.Element;
  }

  interface Children {
      [key: number]: ChildProps;
  }

  export function getTabNames(children?: unknown) {
      const tabNames: string[] = [];

      if (children && Array.isArray(children) && children.length > 1) {
          const childAtIndexOne = children[1];
          if (
              Array.isArray(childAtIndexOne) &&
              childAtIndexOne.length > 1 &&
              typeof childAtIndexOne[0] === 'object' &&
              childAtIndexOne[0].props &&
              childAtIndexOne[0].props.children
          ) {
              const childrenArray: Children = childAtIndexOne[0].props.children;

              for (const cIndex in childrenArray) {
                  const children = childrenArray[cIndex];
                  for (const key in children) {
                      if (Object.prototype.hasOwnProperty.call(children, key)) {
                          const childElement = children[key as keyof ChildProps];
                          if (
                              childElement &&
                              childElement.props &&
                              childElement.props.children &&
                              childElement.props.children[1] &&
                              childElement.props.children[1][0] &&
                              childElement.props.children[1][0].props &&
                              childElement.props.children[1][0].props.children &&
                              childElement.props.children[1][0].props.children[1] &&
                              childElement.props.children[1][0].props.children[1][0]
                          ) {
                              tabNames.push(childElement.props.children[1][0].props.children[1][0].props.children[0]);
                          }
                      }
                  }
              }
          }
      }
      return tabNames;
  }



  export function getTabContents(children?: unknown) {
      const tabContents: JSX.Element[] = [];

      if (
          children &&
          Array.isArray(children) &&
          children.length > 1 &&
          Array.isArray(children[1]) &&
          children[1].length > 1 &&
          typeof children[1][1] === 'object' &&
          children[1][1].props &&
          children[1][1].props.children
      ) {
          const childrenArray: [] = children[1][1].props.children[1];

          for (const cIndex in childrenArray) {
              const children = childrenArray[cIndex];
              tabContents.push(children);
          }
      }
      return tabContents;
  }
}
