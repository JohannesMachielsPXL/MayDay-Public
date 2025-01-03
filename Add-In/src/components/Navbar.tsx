import React, { useState } from "react";
import { Pivot, PivotItem } from "@fluentui/react";
import { faChartSimple, faGear, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CategoryList from "./list/CategoryList";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Settings from "./settings/Settings";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const renderIcon = (icon: IconProp) => <FontAwesomeIcon icon={icon} style={{ marginRight: 8 }} />;

  return (
    <div>
      <Pivot
        className="nav nav-tabs"
        aria-label="Navigation Bar"
        styles={{
          root: {
            margin: "0 auto",
            maxWidth: "600px",
            backgroundColor: "gray"
          }
        }}
        onLinkClick={(item) => setActiveTab(item.props.itemKey || "home")} // Update active tab
      >
        <PivotItem
          className="nav-item"
          itemKey="home"
          onRenderItemLink={() => <span data-testid="home-tab">{renderIcon(faHouse as IconProp)}</span>}
        >
          <CategoryList key={activeTab} />
          {/*Rendert opnieuw bij elke tab switch, nodig voor Playwright*/}
        </PivotItem>
        <PivotItem
          className="nav-item"
          itemKey="charts"
          onRenderItemLink={() => <span data-testid="charts-tab">{renderIcon(faChartSimple as IconProp)}</span>}
        >
          {/*TODO: Implement Charts*/}
          <div>Charts Goes Here</div>
        </PivotItem>
        <PivotItem
          className="nav-item"
          itemKey="settings"
          onRenderItemLink={() => <span data-testid="settings-tab">{renderIcon(faGear as IconProp)}</span>}
        >
          <Settings />
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default Navbar;
