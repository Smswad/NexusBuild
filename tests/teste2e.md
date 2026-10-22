> nexusbuild@0.0.0 test:e2e
> playwright test

Running 140 tests using 1 worker

[1/140] [chromium] › tests\01_homepage.spec.ts:16:3 › 01. Homepage & Landing Experience › 01.01 should load Homepage and have valid page title
[2/140] [chromium] › tests\01_homepage.spec.ts:20:3 › 01. Homepage & Landing Experience › 01.02 should display brand logo link navigating to home
[3/140] [chromium] › tests\01_homepage.spec.ts:26:3 › 01. Homepage & Landing Experience › 01.03 should display top navigation links in header
[4/140] [chromium] › tests\01_homepage.spec.ts:34:3 › 01. Homepage & Landing Experience › 01.04 should display Login and Register CTA buttons in navbar
[5/140] [chromium] › tests\01_homepage.spec.ts:40:3 › 01. Homepage & Landing Experience › 01.05 should display hero section headline and sub-headline
[6/140] [chromium] › tests\01_homepage.spec.ts:49:3 › 01. Homepage & Landing Experience › 01.06 should have hero CTA linking to Explore All Projects
[7/140] [chromium] › tests\01_homepage.spec.ts:55:3 › 01. Homepage & Landing Experience › 01.07 should have hero CTA linking to Interactive GIS Map
[8/140] [chromium] › tests\01_homepage.spec.ts:61:3 › 01. Homepage & Landing Experience › 01.08 should display hero statistics counters
[9/140] [chromium] › tests\01_homepage.spec.ts:68:3 › 01. Homepage & Landing Experience › 01.09 should render Signature Developments section header
[10/140] [chromium] › tests\01_homepage.spec.ts:74:3 › 01. Homepage & Landing Experience › 01.10 should render featured project cards in Signature Developments
[11/140] [chromium] › tests\01_homepage.spec.ts:79:3 › 01. Homepage & Landing Experience › 01.11 should have link to View All Projects from featured section
[12/140] [chromium] › tests\01_homepage.spec.ts:85:3 › 01. Homepage & Landing Experience › 01.12 should display Neighborhoods section with prime sectors
[13/140] [chromium] › tests\01_homepage.spec.ts:93:3 › 01. Homepage & Landing Experience › 01.13 should have Launch Interactive GIS Map button in neighborhoods section
[14/140] [chromium] › tests\01_homepage.spec.ts:99:3 › 01. Homepage & Landing Experience › 01.14 should display Professional Services & Remodeling section
[15/140] [chromium] › tests\01_homepage.spec.ts:107:3 › 01. Homepage & Landing Experience › 01.15 should display Empowering Property Owners platform section
[16/140] [chromium] › tests\01_homepage.spec.ts:115:3 › 01. Homepage & Landing Experience › 01.16 should have working Client Portal Login link in platform card
[17/140] [chromium] › tests\01_homepage.spec.ts:121:3 › 01. Homepage & Landing Experience › 01.17 should render full Footer component with contact info and copyright
[18/140] [chromium] › tests\01_homepage.spec.ts:129:3 › 01. Homepage & Landing Experience › 01.18 should have Newsletter subscription input in footer
[19/140] [chromium] › tests\02_projects_catalog.spec.ts:15:3 › 02. Public Catalog & Search Flows › 02.01 should load Projects page and display hero title
[20/140] [chromium] › tests\02_projects_catalog.spec.ts:22:3 › 02. Public Catalog & Search Flows › 02.02 should display Signature Developments section heading on projects page
[21/140] [chromium] › tests\02_projects_catalog.spec.ts:28:3 › 02. Public Catalog & Search Flows › 02.03 should display multiple project cards in the catalog
[22/140] [chromium] › tests\02_projects_catalog.spec.ts:35:3 › 02. Public Catalog & Search Flows › 02.04 should display project location badges on cards
[23/140] [chromium] › tests\02_projects_catalog.spec.ts:40:3 › 02. Public Catalog & Search Flows › 02.05 should display project property type badges (Mixed Use / Residential)
[24/140] [chromium] › tests\02_projects_catalog.spec.ts:45:3 › 02. Public Catalog & Search Flows › 02.06 should have Project Details buttons on each catalog card
[25/140] [chromium] › tests\02_projects_catalog.spec.ts:50:3 › 02. Public Catalog & Search Flows › 02.07 should have View Map buttons on each catalog card
[26/140] [chromium] › tests\02_projects_catalog.spec.ts:55:3 › 02. Public Catalog & Search Flows › 02.08 should search for Sardar Tower in top navbar and see dropdown item
[27/140] [chromium] › tests\02_projects_catalog.spec.ts:62:3 › 02. Public Catalog & Search Flows › 02.09 should navigate to Sardar Tower details when clicking search result
[28/140] [chromium] › tests\02_projects_catalog.spec.ts:70:3 › 02. Public Catalog & Search Flows › 02.10 should search for Green Valley in top navbar and navigate to p2
[29/140] [chromium] › tests\02_projects_catalog.spec.ts:78:3 › 02. Public Catalog & Search Flows › 02.11 should show empty search state in dropdown when no matching projects exist
[30/140] [chromium] › tests\02_projects_catalog.spec.ts:84:3 › 02. Public Catalog & Search Flows › 02.12 should clear search query when clicking the X button in navbar search
...
[126/140] [chromium] › tests\08_admin_portal.spec.ts:149:5 › 08. Admin Control Panel Flows › Authenticated Admin Portal › 08.20 should have working Logout button redirecting to login page
[127/140] [chromium] › tests\09_components_and_forms.spec.ts:14:3 › 09. Interactive Components & Forms Flows › 09.01 should display floating ChatWidget trigger button on Home page
[128/140] [chromium] › tests\09_components_and_forms.spec.ts:20:3 › 09. Interactive Components & Forms Flows › 09.02 should open ChatWidget window when clicked
[129/140] [chromium] › tests\09_components_and_forms.spec.ts:27:3 › 09. Interactive Components & Forms Flows › 09.03 should display automated greeting messages in ChatWidget
[130/140] [chromium] › tests\09_components_and_forms.spec.ts:33:3 › 09. Interactive Components & Forms Flows › 09.04 should display quick prompt pill buttons in ChatWidget
[131/140] [chromium] › tests\09_components_and_forms.spec.ts:40:3 › 09. Interactive Components & Forms Flows › 09.05 should type and send message in ChatWidget with mock API reply
[132/140] [chromium] › tests\09_components_and_forms.spec.ts:60:3 › 09. Interactive Components & Forms Flows › 09.06 should close ChatWidget window when clicking close button
[133/140] [chromium] › tests\09_components_and_forms.spec.ts:70:3 › 09. Interactive Components & Forms Flows › 09.07 should load Contact page and display all 3 contact cards
[134/140] [chromium] › tests\09_components_and_forms.spec.ts:77:3 › 09. Interactive Components & Forms Flows › 09.08 should display office address and business operating hours on contact page
[135/140] [chromium] › tests\09_components_and_forms.spec.ts:83:3 › 09. Interactive Components & Forms Flows › 09.09 should validate required fields in contact form
[136/140] [chromium] › tests\09_components_and_forms.spec.ts:96:3 › 09. Interactive Components & Forms Flows › 09.10 should submit Contact Form and show success confirmation message
[137/140] [chromium] › tests\09_components_and_forms.spec.ts:115:3 › 09. Interactive Components & Forms Flows › 09.11 should display openstreetmap external directions link on contact page
[138/140] [chromium] › tests\09_components_and_forms.spec.ts:122:3 › 09. Interactive Components & Forms Flows › 09.12 should test responsive mobile viewport menu toggle
[139/140] [chromium] › tests\09_components_and_forms.spec.ts:132:3 › 09. Interactive Components & Forms Flows › 09.13 should test responsive mobile search bar toggle
[140/140] [chromium] › tests\09_components_and_forms.spec.ts:142:3 › 09. Interactive Components & Forms Flows › 09.14 should maintain persistent chat icon across different routes

  140 passed (1.7m)