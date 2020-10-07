/* tslint:disable:no-console */
import * as ipc from 'node-ipc';

ipc.config.id = 'proxy';
ipc.config.retry = 1500;
ipc.config.logger = console.warn; // Stdout is used for native messaging

export default class IPC {
    private connected = false;

    connect() {
        ipc.connectTo('bitwarden', () => {
            ipc.of.bitwarden.on('connect', () => {
                this.connected = true;
                console.error(
                    '## connected to bitwarden desktop ##',
                    ipc.config.delay
                );
                ipc.of.bitwarden.emit('message', 'hello');
            });

            ipc.of.bitwarden.on('disconnect', () => {
                this.connected = false;
                console.error('disconnected from world');
            });

            ipc.of.bitwarden.on('message', (data: any) => {
                console.error('got a message from world : ', data);
            });

            /*
            ipc.of.bitwarden.on('error', (err: any) => {
                console.error('error', err);
            });
            */
        });
    }

    isConnected(): boolean {
        return this.connected;
    }

    send(json: object) {
        ipc.of.bitwarden.emit('message', json);
    }
}