import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreatmentsArray } from "@/types";
import ActiveTreatments from "./ActiveTreatments";
import InactiveTreatments from "./InactiveTreatments";
import { TreatmentCategory, TreatmentComponents } from "@prisma/client";

interface AdminTreatmentsProps {
  treatments: TreatmentsArray | null;
  categories: TreatmentCategory[] | null;
  components: TreatmentComponents[] | null;
}

const AdminTreatments = ({
  treatments,
  categories,
  components,
}: AdminTreatmentsProps) => {
  const TabsHeader = [
    {
      name: "Active Treatment",
      value: "activeTreatment",
    },
    {
      name: "Inactive Treatment",
      value: "inactiveTreatment",
    },
  ];

  return (
    <div>
      <Tabs defaultValue='activeTreatment'>
        <TabsList className='flex gap-5 bg-transparent'>
          {TabsHeader.map((tab, index) => (
            <TabsTrigger
              key={index}
              value={tab.value}
              className='data-[state=active]:hover:bg-transparent hover:text-brand-primary-blue hover:underline rounded-lg cursor-pointer transition-all'
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Active Treatments Tab */}
        <TabsContent value='activeTreatment' className='mt-5'>
          <ActiveTreatments
            treatments={treatments}
            categories={categories}
            components={components}
          />
        </TabsContent>

        {/* Inactive Treatments Tab */}
        <TabsContent value='inactiveTreatment' className='mt-5 p-3'>
          <InactiveTreatments treatments={treatments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTreatments;
