import { Header } from "@/components/Header";

export default function BuzzersInfo7(): React.ReactElement {
  return(
    <>
      <Header
        title=""
        showIdeaButton={false}
      />
      <div className="h-screen flex flex-col items-center gap-3.5">
        <h2 className="text-ubuntu tx-bl font-medium text-lg mb-1"> Upload do arquivo</h2>
      </div>
    </>
  );
}