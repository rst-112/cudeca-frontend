import { FunctionComponent } from 'react';
import styles from './CreacinDeEventos.module.css';


const CreacinDeEventos = () => {
  	return (
    		<div className={styles.creacinDeEventos}>
      			<div className={styles.app}>
        				<div className={styles.sidebar}>
          					<div className={styles.container} />
          					<div className={styles.container2}>
            						<div className={styles.container3}>
              							<div className={styles.container4} />
              							<div className={styles.heading}>
                								<div className={styles.fundacinCudeca}>Fundación Cudeca</div>
              							</div>
              							<div className={styles.paragraph}>
                								<div className={styles.cudecaAdmin}>Cudeca Admin</div>
              							</div>
            						</div>
            						<div className={styles.navigation}>
              							<div className={styles.container1}>
                								<div className={styles.heading1}>
                  									<img className={styles.icon} alt="" />
                  									<div className={styles.paragraph2}>
                    										<div className={styles.eventos}>Eventos</div>
                  									</div>
                								</div>
                								<div className={styles.listitem}>
                  									<div className={styles.cudecaAdmin}>Gestión de eventos</div>
                								</div>
              							</div>
              							<div className={styles.container22}>
                								<div className={styles.heading1}>
                  									<div className={styles.icon1}>
                    										<div className={styles.icon2} />
                  									</div>
                  									<div className={styles.paragraph3}>
                    										<div className={styles.eventos}>Ventas</div>
                  									</div>
                								</div>
                								<div className={styles.list}>
                  									<div className={styles.listitem1}>
                    										<div className={styles.cudecaAdmin}>Ver Compras</div>
                  									</div>
                  									<div className={styles.listitem2}>
                    										<div className={styles.cudecaAdmin}>Reembolsos Manuales</div>
                  									</div>
                  									<div className={styles.listitem3}>
                    										<div className={styles.cudecaAdmin}>Más +</div>
                  									</div>
                								</div>
              							</div>
              							<div className={styles.container32}>
                								<div className={styles.heading1}>
                  									<img className={styles.icon} alt="" />
                  									<div className={styles.paragraph4}>
                    										<div className={styles.eventos}>Configuración</div>
                  									</div>
                								</div>
                								<div className={styles.list1}>
                  									<div className={styles.listitem4}>
                    										<div className={styles.cudecaAdmin}>Gestión de usuarios</div>
                  									</div>
                  									<div className={styles.listitem5}>
                    										<div className={styles.cudecaAdmin}>Exportar Datos</div>
                  									</div>
                								</div>
              							</div>
            						</div>
            						<img className={styles.buttonIcon} alt="" />
            						<div className={styles.container42}>
              							<div className={styles.container5} />
              							<div className={styles.button}>
                								<div className={styles.container6} />
                								<img className={styles.icon3} alt="" />
                								<div className={styles.paragraph5}>
                  									<div className={styles.eventos}>Salir</div>
                								</div>
              							</div>
            						</div>
          					</div>
        				</div>
        				<div className={styles.mainpanel}>
          					<div className={styles.heading4}>
            						<div className={styles.formularioDeCreacin}>Formulario de creación de eventos</div>
          					</div>
          					<div className={styles.container52}>
            						<div className={styles.container7} />
            						<div className={styles.button1}>
              							<div className={styles.container8} />
              							<div className={styles.container9}>
                								<div className={styles.paragraph6}>
                  									<div className={styles.eventos}>Información General</div>
                								</div>
              							</div>
            						</div>
            						<div className={styles.button2}>
              							<div className={styles.paragraph6}>
                								<div className={styles.eventos}>Tipos de Entrada</div>
              							</div>
            						</div>
          					</div>
          					<div className={styles.eventform}>
            						<div className={styles.container10}>
              							<div className={styles.container15}>
                								<div className={styles.container92}>
                  									<div className={styles.container62}>
                    										<div className={styles.label}>
                      											<div className={styles.cudecaAdmin}>Nombre del evento</div>
                    										</div>
                    										<div className={styles.textinput}>
                      											<div className={styles.container11}>
                        												<div className={styles.paragraph8}>
                          													<div className={styles.introduzcaUnNombre}>Introduzca un nombre</div>
                        												</div>
                      											</div>
                      											<div className={styles.container12} />
                    										</div>
                  									</div>
                  									<div className={styles.container72}>
                    										<div className={styles.label1}>
                      											<div className={styles.cudecaAdmin}>Descripción del evento</div>
                    										</div>
                    										<div className={styles.textarea}>
                      											<div className={styles.container13}>
                        												<div className={styles.paragraph6}>
                          													<div className={styles.textoDondeDescriba}>Texto donde describa al evento</div>
                        												</div>
                      											</div>
                      											<div className={styles.container14} />
                    										</div>
                  									</div>
                  									<div className={styles.container82}>
                    										<div className={styles.label2}>
                      											<div className={styles.cudecaAdmin}>URL de la imagen</div>
                    										</div>
                    										<div className={styles.textinput}>
                      											<div className={styles.container11}>
                        												<div className={styles.paragraph10}>
                          													<div className={styles.introduzcaUnNombre}>https://.../imagen.jpg</div>
                          													</div>
                        												</div>
                        												<div className={styles.container12} />
                      											</div>
                    										</div>
                  									</div>
                  									<div className={styles.container142}>
                    										<div className={styles.container62}>
                      											<div className={styles.label3}>
                        												<div className={styles.cudecaAdmin}>Fecha de inicio</div>
                      											</div>
                      											<div className={styles.textinput}>
                        												<div className={styles.container11}>
                          													<div className={styles.paragraph11}>
                            														<div className={styles.diamesao}>dia/mes/año</div>
                          													</div>
                        												</div>
                        												<div className={styles.container12} />
                      											</div>
                    										</div>
                    										<div className={styles.container112}>
                      											<div className={styles.label4}>
                        												<div className={styles.cudecaAdmin}>Fecha de fin</div>
                      											</div>
                      											<div className={styles.textinput}>
                        												<div className={styles.container11}>
                          													<div className={styles.paragraph11}>
                            														<div className={styles.diamesao}>dia/mes/año</div>
                          													</div>
                        												</div>
                        												<div className={styles.container12} />
                      											</div>
                    										</div>
                    										<div className={styles.container122}>
                      											<div className={styles.label5}>
                        												<div className={styles.cudecaAdmin}>Lugar de evento</div>
                      											</div>
                      											<div className={styles.textinput}>
                        												<div className={styles.container11}>
                          													<div className={styles.paragraph13}>
                            														<div className={styles.introduzcaUnNombre}>Dirección</div>
                          													</div>
                        												</div>
                        												<div className={styles.container12} />
                      											</div>
                    										</div>
                    										<div className={styles.container132}>
                      											<div className={styles.label6}>
                        												<div className={styles.cudecaAdmin}>Objetivo de recaudación</div>
                      											</div>
                      											<div className={styles.textinput}>
                        												<div className={styles.container11}>
                          													<div className={styles.paragraph14}>
                            														<div className={styles.introduzcaUnNombre}>Introduzca un objetivo en euros</div>
                          													</div>
                        												</div>
                        												<div className={styles.container12} />
                      											</div>
                    										</div>
                  									</div>
                								</div>
                								<div className={styles.container162}>
                  									<div className={styles.container27} />
                  									<div className={styles.button3}>
                    										<div className={styles.container28} />
                    										<div className={styles.container29}>
                      											<div className={styles.paragraph6}>
                        												<div className={styles.eventos}>Descartar</div>
                      											</div>
                    										</div>
                  									</div>
                  									<div className={styles.button4}>
                    										<div className={styles.container30} />
                    										<div className={styles.container31}>
                      											<div className={styles.paragraph6}>
                        												<div className={styles.eventos}>Guardar Borrador</div>
                      											</div>
                    										</div>
                  									</div>
                  									<div className={styles.button5}>
                    										<div className={styles.container33} />
                    										<div className={styles.container34}>
                      											<div className={styles.paragraph6}>
                        												<div className={styles.eventos}>Publicar Evento</div>
                      											</div>
                    										</div>
                  									</div>
                								</div>
              							</div>
              							<div className={styles.container35} />
            						</div>
          					</div>
        				</div>
      			</div>);
      			};
      			
      			export default CreacinDeEventos as FunctionComponent;
      			