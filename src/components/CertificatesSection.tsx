import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const certificates = [{
  title: "Deep Learning Specialization",
  issuer: "DeepLearning.ai",
  year: "2023",
  courses: 5,
  url: "https://coursera.org/verify/specialization/M6X5QHSKFW2E",
  logo: "/img-compressed/91b30ba7-314d-47d8-9cd9-fb352c331a69.png"
}, {
  title: "Machine Learning Specialization",
  issuer: "DeepLearning.ai",
  year: "2023",
  courses: 3,
  url: "https://coursera.org/verify/specialization/B4CL2GCZ3UWS",
  logo: "/img-compressed/91b30ba7-314d-47d8-9cd9-fb352c331a69.png"
}, {
  title: "Machine Learning Engineering for Production (MLOps)",
  issuer: "DeepLearning.ai",
  year: "2024",
  courses: 4,
  url: "https://coursera.org/verify/specialization/6DAZ5D67ZRPK",
  logo: "/img-compressed/91b30ba7-314d-47d8-9cd9-fb352c331a69.png"
}, {
  title: "TensorFlow Developer Professional Certificate",
  issuer: "DeepLearning.ai",
  year: "2023",
  courses: 4,
  url: "https://www.coursera.org/account/accomplishments/professional-cert/GH8BHEYDYRA4",
  logo: "/img-compressed/91b30ba7-314d-47d8-9cd9-fb352c331a69.png"
}, {
  title: "Google Data Analytics Professional Certificate",
  issuer: "Google",
  year: "2023",
  courses: 8,
  url: "https://www.coursera.org/account/accomplishments/specialization/certificate/XBVLYF42H3F5",
  logo: "/img-compressed/4974c8fe-b57e-49b8-ae2c-8b4df34c5bc4.png"
}, {
  title: "Entrepreneurship Specialization",
  issuer: "Wharton School of University of Pennsylvania",
  year: "2023",
  courses: 5,
  url: "https://www.coursera.org/account/accomplishments/specialization/certificate/XBVLYF42H3F5",
  logo: "/img-compressed/a8f34605-3ab7-4b6e-980a-86a485dbecf8.png"
}, {
  title: "Successful Negotiation: Essential Strategies and Skills",
  issuer: "University of Michigan",
  year: "2022",
  url: "https://www.coursera.org/account/accomplishments/certificate/34RVMRBFHWQB",
  logo: "/img-compressed/3f1d184b-401d-423e-a537-b8e034728e1e.png"
}, {
  title: "Fundamentals of Digital Marketing",
  issuer: "Google",
  year: "2020",
  url: "https://learndigital.withgoogle.com/link/1qsdpcedm9s",
  logo: "/img-compressed/4974c8fe-b57e-49b8-ae2c-8b4df34c5bc4.png"
}, {
  title: "Cisco IT Essentials",
  issuer: "Cisco Networking Academy",
  year: "2016",
  url: "https://www.linkedin.com/in/geethikaisuru/details/certifications/",
  logo: "/img-compressed/7964df05-1e6b-47ad-8de9-b010768f6269.png"
}];
export function CertificatesSection() {
  return <section id="certificates" className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.8
      }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications 📜</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional certifications and specializations from leading institutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => <motion.div key={cert.title} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }}>
              <a href={cert.url} target="_blank" rel="noopener noreferrer">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:hover:shadow-primary/5">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="h-14 w-14 min-w-14 rounded-lg overflow-hidden bg-white flex items-center justify-center p-1.5">
                      <img src={cert.logo} alt={`${cert.issuer} logo`} className="w-10 h-10 object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-lg leading-tight">{cert.title}</h3>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{cert.year}</Badge>
                      {cert.courses && <span className="text-sm text-muted-foreground">
                          {cert.courses} courses
                        </span>}
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>)}
        </div>
      </div>
    </section>;
}