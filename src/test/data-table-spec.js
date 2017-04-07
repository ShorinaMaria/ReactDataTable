import React from 'react';
import DataTable from '../components/data-table.js';
import ReactTestUtils from 'react-addons-test-utils';

describe('DataTable', () => {


    if(window.EventSource){

        function checkProp(prop){
            let keys = Object.keys(prop);
            expect(keys).toContain('_id');
            expect(keys).toContain('measurements');
            expect(keys).toContain('name');
            if(prop.name != 'Serial' && prop.name != 'Location'){
                expect(keys).toContain('unit');
            }
            prop.measurements.forEach( m => {
                expect(m.length).toEqual(2);
                let measure = m[1];
                expect(typeof measure).toMatch('string|number|object');
                if(typeof measure === 'object'){
                    expect(measure instanceof Array).toBeTruthy();
                }
            });
        }

        describe('check component state', () => {
            let dataTable, state;

            beforeEach(done => {
                dataTable = ReactTestUtils.renderIntoDocument(<DataTable />);

                setTimeout(() => {
                    state = dataTable.state;
                    dataTable.componentWillUnmount();
                    done();
                }, 1000);
            });

            it('has valid column headers', () => {
                expect(state.columns).toBeDefined();
                expect(Object.keys(state.columns).length).toBeGreaterThan(0);
            });

            it('has some data', () => {
                expect(state.messages).toBeDefined();
                expect(Object.keys(state.messages).length).toBeGreaterThan(0);
            });

            it('has expected data', () => {
                state.messages.forEach(item => {
                    Object.keys(item).forEach(prop => {
                        checkProp(item[prop]);
                    })
                });
            });

            it('doesn\'t change after unmounting', done => {
                setTimeout(() => {
                    let isSameState = Object.is(state, dataTable.state);
                    expect(isSameState).toBeTruthy();
                    done();
                },1000);
            });

        });

        describe('api', () => {
            let eventSource;
            let isConnected = false;
            let data = [];

            beforeEach(done => {
                eventSource = new EventSource(AppConfig.serverUrl);

                eventSource.onopen = () => {
                    isConnected = true;
                }
                eventSource.onerror = () => {
                    done();
                }
                eventSource.onmessage = e => {
                    try{
                        data = JSON.parse(e.data);
                    }catch(error){
                        console.log(error);
                    }finally{
                        done();
                    }
                }
            });

            afterEach(() => {
                eventSource.close();
            });

            it('server connection and server data are ok', () => {
                expect(isConnected).toBeTruthy();
                expect(data.length).toBeGreaterThan(0);
            });

        });


    }else{

        describe('component rendering', () =>{
            it('renders as expected', () =>{
                let dataTable = ReactTestUtils.renderIntoDocument(<DataTable />);
                let state = dataTable.state;
                expect(state.columns).toBeDefined();
                expect(state.messages).toBeDefined();
            });
        });


    }



});
