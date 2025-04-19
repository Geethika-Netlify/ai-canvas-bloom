
import { motion } from "framer-motion";
import { GraduationCap, Award, Medal, Certificate } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const certificates = [
  {
    title: "Deep Learning Specialization",
    issuer: "DeepLearning.ai",
    year: "2023",
    courses: 5,
    url: "https://coursera.org/verify/specialization/M6X5QHSKFW2E",
    icon: GraduationCap,
  },
  {
    title: "Machine Learning Specialization",
    issuer: "DeepLearning.ai",
    year: "2023",
    courses: 3,
    url: "https://coursera.org/verify/specialization/B4CL2GCZ3UWS",
    icon: Award,
  },
  {
    title: "Machine Learning Engineering for Production (MLOps)",
    issuer: "DeepLearning.ai",
    year: "2024",
    courses: 4,
    url: "https://coursera.org/verify/specialization/6DAZ5D67ZRPK",
    icon: Medal,
  },
  {
    title: "TensorFlow Developer Professional Certificate",
    issuer: "DeepLearning.ai",
    year: "2023",
    courses: 4,
    url: "https://www.coursera.org/account/accomplishments/professional-cert/GH8BHEYDYRA4",
    icon: Certificate,
  },
  {
    title: "Google Data Analytics Professional Certificate",
    issuer: "Google",
    year: "2023",
    courses: 8,
    url: "https://www.coursera.org/account/accomplishments/specialization/certificate/XBVLYF42H3F5",
    icon: Award,
  },
  {
    title: "Entrepreneurship Specialization",
    issuer: "Wharton School of University of Pennsylvania",
    year: "2023",
    courses: 5,
    url: "https://www.coursera.org/account/accomplishments/specialization/certificate/XBVLYF42H3F5",
    icon: GraduationCap,
  },
  {
    title: "Successful Negotiation: Essential Strategies and Skills",
    issuer: "University of Michigan",
    year: "2022",
    url: "https://www.coursera.org/account/accomplishments/certificate/34RVMRBFHWQB",
    icon: Medal,
  },
  {
    title: "Fundamentals of Digital Marketing",
    issuer: "Google",
    year: "2020",
    url: "https://learndigital.withgoogle.com/link/1qsdpcedm9s",
    icon: Certificate,
  },
  {
    title: "Cisco IT Essentials",
    issuer: "Cisco Networking Academy",
    year: "2016",
    url: "https://www.linkedin.com/in/geethikaisuru/details/certifications/",
    icon: Award,
  },
];

export function CertificatesSection() {
  return (
    <section id="certificates" className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional certifications and specializations from leading institutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <a href={cert.url} target="_blank" rel="noopener noreferrer">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:hover:shadow-primary/5">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <cert.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-lg leading-tight">{cert.title}</h3>
                      <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{cert.year}</Badge>
                      {cert.courses && (
                        <span className="text-sm text-muted-foreground">
                          {cert.courses} courses
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
