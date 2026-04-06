# Design Approach

This document explains the key architectural and design decisions made during the development of the Zorvyn Finance Intelligence Dashboard. Each decision is grounded in specific requirements from the Product Requirements Document (PRD) and reflects careful consideration of user experience, maintainability, and technical excellence.

## State Management: Zustand over Redux

**Decision**: Use Zustand for global state management instead of Redux.

**Rationale**: Zustand provides a simpler, more intuitive API with significantly less boilerplate code compared to Redux. For a dashboard application with straightforward state requirements (transactions, filters, UI preferences, user roles), Zustand's minimalist approach offers several advantages:

- **Less Boilerplate**: No need for actions, action creators, reducers, or complex middleware setup. State updates are direct function calls.
- **Better TypeScript Integration**: Zustand's API is TypeScript-first, providing excellent type inference without additional configuration.
- **Smaller Bundle Size**: Zustand is ~1KB gzipped compared to Redux's ~3KB, contributing to faster load times.
- **Built-in Persistence**: The `persist` middleware integrates seamlessly for localStorage persistence without additional libraries.
- **Simpler Mental Model**: Direct state mutations within setter functions are easier to understand than Redux's immutable update patterns.

The application uses four separate Zustand stores (`transactionsStore`, `roleStore`, `uiStore`, `toastStore`) to maintain clear separation of concerns while keeping each store focused and maintainable.

**PRD Reference**: Section 8.1 (State Management Architecture), Section 14.1 (Acceptance Criteria - localStorage persistence)

## Typography: Inter Font Family

**Decision**: Use Inter as the primary font family with a carefully calibrated size scale.

**Rationale**: Inter is a modern, open-source typeface specifically designed for digital interfaces and screen readability. The font choice supports both aesthetic appeal and functional requirements:

- **Optimized for Screens**: Inter's letterforms are designed with tall x-heights and open apertures, improving readability at small sizes common in data-dense dashboards.
- **Excellent Number Rendering**: Tabular figures ensure consistent alignment in financial tables and charts, critical for scanning transaction amounts.
- **Wide Language Support**: Comprehensive character set supports international currency symbols and special characters.
- **Professional Appearance**: Clean, neutral aesthetic aligns with financial application expectations without appearing overly corporate.

The typography scale follows a modular approach with clear hierarchy: headings (text-2xl to text-lg), body text (text-base), and supporting text (text-sm, text-xs). This creates visual rhythm and guides users through information density.

**PRD Reference**: Section 9.2 (Typography System), Section 13.1 (Visual Design - Professional aesthetic)

## Color Palette: Navy and Teal Brand Identity

**Decision**: Implement a navy-teal color scheme with WCAG AA compliant contrast ratios.

**Rationale**: The color palette balances brand identity with accessibility requirements:

- **Navy (Primary)**: Deep navy blues (#0A1628, #0F1F3A, #1A2B4A) convey trust, stability, and professionalism—essential qualities for financial applications. Navy provides excellent contrast for white text while avoiding the harshness of pure black.
- **Teal (Accent)**: Teal shades (#14B8A6, #2DD4BF) add visual interest and energy without overwhelming the interface. Teal is used strategically for interactive elements, positive financial indicators, and data visualizations.
- **WCAG Compliance**: All text-background combinations meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text). This ensures readability for users with visual impairments and in various lighting conditions.
- **Dark Mode Support**: Extended gray scale (gray-50 to gray-950) enables seamless dark mode with maintained contrast ratios. Dark mode uses lighter teal variants to preserve visibility against dark backgrounds.

The palette supports semantic color usage: green for income/positive changes, red for expenses/negative changes, and neutral grays for informational content.

**PRD Reference**: Section 9.1 (Color System), Section 10.3 (Accessibility - Color contrast), Section 14.1 (Dark mode support)

## RBAC UX Philosophy: Feature Hiding vs. Disabling

**Decision**: Hide restricted features from ANALYST role rather than showing them as disabled.

**Rationale**: This approach prioritizes clean user experience over explicit permission visibility:

- **Reduced Cognitive Load**: Users don't see features they can't use, eliminating frustration and confusion. The interface adapts to show only relevant capabilities.
- **Cleaner Interface**: Hiding unavailable features creates a more streamlined UI without disabled buttons cluttering the screen.
- **Role-Appropriate Experience**: Each role sees an interface tailored to their permissions, making the application feel purpose-built rather than restricted.
- **Implementation Simplicity**: Conditional rendering based on role checks is straightforward and maintainable compared to managing disabled states across multiple components.

For example, ANALYST users never see the CSV export button or transaction edit/delete actions. This creates a read-only experience that feels intentional rather than limited. ADMIN users see the full feature set, reinforcing their elevated permissions.

**PRD Reference**: Section 7.2 (Role-Based Access Control), Section 14.1 (Role switching functionality)

## Heatmap Visualization: Pattern Discovery Through Visual Density

**Decision**: Implement a 7×6 transaction activity heatmap (days × time slots) as a core dashboard widget.

**Rationale**: The heatmap serves as a powerful pattern discovery tool that reveals temporal spending behaviors:

- **Pattern Recognition**: Visual density encoding makes it immediately obvious when transactions cluster (e.g., weekend dining, weekday morning commutes). Users can spot habits without analyzing raw data.
- **Temporal Context**: The day-of-week and time-of-day dimensions capture the full temporal context of financial behavior, revealing patterns that simple time-series charts miss.
- **Compact Information Density**: A 7×6 grid communicates 42 data points in a small space, making efficient use of dashboard real estate.
- **Actionable Insights**: Identifying peak transaction times helps users understand their spending triggers and plan better financial decisions.
- **Accessibility Considerations**: Each cell includes hover tooltips and keyboard navigation support, ensuring the visualization is usable with assistive technologies.

The heatmap complements other visualizations (line chart for trends, donut chart for categories) by adding a unique temporal dimension to financial analysis.

**PRD Reference**: Section 5.4 (Transaction Activity Heatmap), Section 14.1 (Dashboard visualizations)

## Mock Data Strategy: Realistic Patterns with Edge Cases

**Decision**: Generate comprehensive mock transaction data spanning 14 months with realistic patterns and deliberate edge cases.

**Rationale**: High-quality mock data is essential for demonstrating application capabilities and ensuring robust testing:

- **Realistic Patterns**: Transactions include recurring monthly expenses (rent, utilities), variable spending (groceries, dining), and irregular income (freelance work). This mirrors real-world financial behavior.
- **Temporal Distribution**: Transactions are distributed across different days of the week and times of day, creating meaningful heatmap patterns and trend visualizations.
- **Category Diversity**: All 13 transaction categories are represented with appropriate amounts and frequencies, ensuring every filter and visualization has data to display.
- **Edge Cases**: The dataset includes boundary conditions like zero-transaction days, high-value transfers, and months with unusual spending patterns. This validates error handling and empty state designs.
- **Sufficient Volume**: ~100 transactions provide enough data for meaningful aggregations and visualizations without overwhelming the interface or causing performance issues.
- **Consistent Structure**: Every transaction includes all required fields (id, timestamps, merchant, tags, notes), demonstrating the full data model and supporting comprehensive filtering.

The mock data enables evaluators to explore all application features immediately without setup, while developers can test edge cases and performance characteristics.

**PRD Reference**: Section 4.1 (Mock Data Generation), Section 14.1 (Feature demonstration requirements)

---

**Document Version**: 1.0  
**Last Updated**: Sprint 5 - Quality Gate & Submission Package  

