import Link from 'next/link';
import Button from "@/components/button";

export default function Index() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-4">Sancties Systeem</h1>
            <p className="lead">Welkom bij het sancties beheersysteem voor docenten</p>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-table"></i>
                    Sancties Beheren
                  </h5>
                  <p className="card-text">
                    Bekijk, voeg toe, bewerk en beheer sancties voor studenten in een overzichtelijke tabel.
                  </p>
                  <Link href="/sancties" className="btn btn-primary">
                    Ga naar Sancties
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-info-circle"></i>
                    Over dit systeem
                  </h5>
                  <p className="card-text">
                    Dit systeem helpt docenten bij het opleggen en beheren van sancties voor studenten.
                  </p>
                  <Button naam="Test Component" />
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Functionaliteiten</h5>
              <ul className="list-unstyled">
                <li><i className="bi bi-check-circle text-success"></i> Sancties opleggen aan studenten</li>
                <li><i className="bi bi-check-circle text-success"></i> Overzicht van alle sancties in tabelformaat</li>
                <li><i className="bi bi-check-circle text-success"></i> Status bijhouden (actief, voltooid, geannuleerd)</li>
                <li><i className="bi bi-check-circle text-success"></i> Zoeken en filteren van sancties</li>
                <li><i className="bi bi-check-circle text-success"></i> Verschillende sanctie types (waarschuwing, nablijven, etc.)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
