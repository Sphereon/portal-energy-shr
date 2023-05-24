import { Col, Container, Modal, Row } from 'react-bootstrap'
import React, { Component } from 'react'
import AuthenticationQR from './AuthenticationQR'
import { AuthorizationResponsePayload } from '@sphereon/did-auth-siop'
import Debug from 'debug'

const debug = Debug('ssi:AuthenticationModal')
/* This is a container dialog for the QR code component. It re emits the onSignInComplete callback.  */

export type AuthenticationModalProps = {
  show?: boolean
  onCloseClicked?: () => void
  onSignInComplete: (payload: AuthorizationResponsePayload) => void
}

interface AuthenticationModalState {
  authRequestRetrieved: boolean
  isCopied: boolean
  qrCodeData: string
}

export default class AuthenticationModal extends Component<
  AuthenticationModalProps,
  AuthenticationModalState
> {
  private readonly scanText = 'Please scan the QR code with your app.'
  private readonly authText = 'Please approve the request in your app.'

  constructor(props: AuthenticationModalProps) {
    super(props)
    this.state = {
      authRequestRetrieved: false,
      isCopied: false,
      qrCodeData: ''
    }
  }

  render() {
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        fullscreen="true"
        show={this.props.show}
      >
        <div className="walletconnect-modal__header">
          <img
            className="walletconnect-modal__headerLogo"
            src="data:image/svg+xml,%3Csvg height='185' viewBox='0 0 300 185' width='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m61.4385429 36.2562612c48.9112241-47.8881663 128.2119871-47.8881663 177.1232091 0l5.886545 5.7634174c2.445561 2.3944081 2.445561 6.2765112 0 8.6709204l-20.136695 19.715503c-1.222781 1.1972051-3.2053 1.1972051-4.428081 0l-8.100584-7.9311479c-34.121692-33.4079817-89.443886-33.4079817-123.5655788 0l-8.6750562 8.4936051c-1.2227816 1.1972041-3.205301 1.1972041-4.4280806 0l-20.1366949-19.7155031c-2.4455612-2.3944092-2.4455612-6.2765122 0-8.6709204zm218.7677961 40.7737449 17.921697 17.546897c2.445549 2.3943969 2.445563 6.2764769.000031 8.6708899l-80.810171 79.121134c-2.445544 2.394426-6.410582 2.394453-8.85616.000062-.00001-.00001-.000022-.000022-.000032-.000032l-57.354143-56.154572c-.61139-.598602-1.60265-.598602-2.21404 0-.000004.000004-.000007.000008-.000011.000011l-57.3529212 56.154531c-2.4455368 2.394432-6.4105755 2.394472-8.8561612.000087-.0000143-.000014-.0000296-.000028-.0000449-.000044l-80.81241943-79.122185c-2.44556021-2.394408-2.44556021-6.2765115 0-8.6709197l17.92172963-17.5468673c2.4455602-2.3944082 6.4105989-2.3944082 8.8561602 0l57.3549775 56.155357c.6113908.598602 1.602649.598602 2.2140398 0 .0000092-.000009.0000174-.000017.0000265-.000024l57.3521031-56.155333c2.445505-2.3944633 6.410544-2.3945531 8.856161-.0002.000034.0000336.000068.0000673.000101.000101l57.354902 56.155432c.61139.598601 1.60265.598601 2.21404 0l57.353975-56.1543249c2.445561-2.3944092 6.410599-2.3944092 8.85616 0z' fill='%233b99fc'/%3E%3C/svg%3E"
          />
          <p
            style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0',
              alignItems: 'flex-start',
              display: 'flex',
              flex: '1 1 0%',
              marginLeft: '5px'
            }}
          >
            WalletConnect
          </p>
          <div className="walletconnect-modal__close__wrapper">
            <div
              className="walletconnect-modal__close__icon"
              onClick={this.props.onCloseClicked}
            >
              <div className="walletconnect-modal__close__line1"></div>
              <div className="walletconnect-modal__close__line2"></div>
            </div>
          </div>
        </div>
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            color: '#00205C',
            alignItems: 'center'
          }}
        >
          <Modal.Title>QR CODE</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container>
            <Row>
              <Col
                className="d-flex justify-content-center"
                style={{
                  color: '#AEAEAE'
                }}
              >
                <h6>
                  {this.state.authRequestRetrieved
                    ? this.authText
                    : this.scanText}
                </h6>
              </Col>
            </Row>
            <Row>
              <Col
                className="d-flex justify-content-center"
                style={{ paddingTop: '10px' }}
              >
                <AuthenticationQR
                  setQrCodeData={this.copyQRCode}
                  onAuthRequestRetrieved={() => {
                    this.setState({ ...this.state, authRequestRetrieved: true })
                  }}
                  onSignInComplete={(payload) =>
                    this.props.onSignInComplete(payload)
                  }
                />
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer
          style={{
            fontSize: '15px',
            fontWeight: '400',
            lineHeight: '30px',
            alignSelf: 'center',
            borderColor: 'white'
          }}
        >
          <a
            id="copyToClipboard"
            href="#"
            onClick={() => this.handleCopyClick()}
          >
            {this.state.isCopied ? 'Copied!' : 'Copy to clipboard'}
          </a>
        </Modal.Footer>
      </Modal>
    )
  }

  private copyTextToClipboard = async (
    text: string
  ): Promise<boolean | void> => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    } else {
      return document.execCommand('copy', true, text)
    }
  }

  private handleCopyClick = (): void => {
    this.copyTextToClipboard(this.state.qrCodeData)
      .then(() => {
        this.setState({ ...this.state, isCopied: true })
        setTimeout(() => {
          this.setState({ ...this.state, isCopied: false })
        }, 1500)
      })
      .catch(debug)
  }

  private copyQRCode = (text: string): void => {
    this.setState({ ...this.state, qrCodeData: text })
  }
}
