# Risk Calculator

A full-stack risk assessment application built with Next.js, featuring a comprehensive risk matrix, CRUD operations, and CSV export functionality.

## Features

- **Risk Assessment Form**: Calculate risk scores based on likelihood and severity
- **5×5 Risk Matrix**: Visual representation of risk levels with counts
- **Risk Register**: Full CRUD operations with filtering and search
- **CSV Export**: Download risk data for external analysis
- **Responsive Design**: Modern UI built with shadcn/ui and Tailwind CSS
- **Type Safety**: Full TypeScript implementation with strict typing
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Database**: Prisma ORM with SQLite (PostgreSQL ready)
- **Validation**: Zod schemas
- **Testing**: Vitest with React Testing Library
- **Notifications**: Sonner toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd risk-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

### Calculating Risks

1. Enter a hazard description in the "Hazard" field
2. Select likelihood from the grouped dropdown (Rare, Occasional, Frequent)
3. Select severity from the grouped dropdown (Slight, Moderate, Extreme)
4. Click "Calculate" to compute the risk score and level

### Risk Matrix

The 5×5 matrix shows:
- **Rows**: Likelihood (1-5)
- **Columns**: Severity (1-5)
- **Cells**: Risk score and count of risks in that category
- **Colors**: Risk level indicators (Low, Medium, High, Critical)

### Managing Risks

- **View**: All risks are displayed in a sortable table
- **Edit**: Click the pencil icon to modify existing risks
- **Delete**: Click the trash icon with confirmation dialog
- **Filter**: Search by hazard text or filter by risk level

### Export Data

Click the "Export CSV" button to download all filtered risks in CSV format.

## API Endpoints

- `GET /api/risks` - List risks with optional filtering
- `POST /api/risks` - Create a new risk
- `PATCH /api/risks/[id]` - Update an existing risk
- `DELETE /api/risks/[id]` - Delete a risk

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

## Database Schema

```prisma
model Risk {
  id         String   @id @default(cuid())
  hazard     String
  likelihood Int
  severity   Int
  score      Int
  level      String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## Risk Calculation

Risk scores are calculated as: `Score = Likelihood × Severity`

Risk levels are determined by:
- **Low**: Score ≤ 4
- **Medium**: Score 5-9
- **High**: Score 10-16
- **Critical**: Score > 16

## Contributing

1. Follow the established code style and patterns
2. Write tests for new functionality
3. Ensure accessibility compliance
4. Use TypeScript strict mode
5. Follow the naming conventions:
   - PascalCase for components and classes
   - camelCase for variables and functions
   - kebab-case for files

## License

This project is licensed under the MIT License.
