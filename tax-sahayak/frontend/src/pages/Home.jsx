import Chatbot from '../components/Chatbot';
import TaxCalculator from '../components/TaxCalculator';
import EMICalculator from '../components/EMICalculator';

const Home = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Tax Sahayak</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <Chatbot />
        </section>
        <section className="space-y-8">
          <TaxCalculator />
          <EMICalculator />
        </section>
      </div>
    </div>
  );
};

export default Home;
